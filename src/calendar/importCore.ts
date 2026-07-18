import ICAL from "ical.js";
import { unzipSync } from "fflate";

import {
  CALENDAR_IMPORT_LIMITS,
  type AllDayCalendarOccurrence,
  type CalendarBytesInput,
  type CalendarImportLimits,
  type CalendarImportOptions,
  type CalendarImportResult,
  type CalendarImportStats,
  type CalendarImportWarning,
  type CalendarOccurrence,
  type CalendarSource,
  type CalendarWindow,
  type IcsTextInput,
  type ImportedEventStatus,
  type TimedCalendarOccurrence,
} from "./types";

type IcalComponent = InstanceType<typeof ICAL.Component>;
type IcalEvent = InstanceType<typeof ICAL.Event>;
type IcalTime = InstanceType<typeof ICAL.Time>;

type MutableImportState = {
  occurrences: CalendarOccurrence[];
  occurrenceIds: Set<string>;
  warnings: CalendarImportWarning[];
  stats: CalendarImportStats;
  truncated: boolean;
  occurrenceLimitWarned: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1_000;
const UTC_TZIDS = new Set(["Z", "UTC", "GMT"]);
const UNSUPPORTED_FREQUENCIES = new Set(["SECONDLY", "MINUTELY", "HOURLY"]);
const LIMIT_WARNING_CODES = new Set<CalendarImportWarning["code"]>([
  "input-too-large",
  "zip-entry-limit",
  "source-limit",
  "uncompressed-limit",
  "component-limit",
  "recurrence-truncated",
  "occurrence-limit",
]);

function mergeLimits(
  overrides: Partial<CalendarImportLimits> | undefined,
): CalendarImportLimits {
  const defaults: CalendarImportLimits = { ...CALENDAR_IMPORT_LIMITS };
  if (!overrides) {
    return defaults;
  }

  for (const key of Object.keys(defaults) as (keyof CalendarImportLimits)[]) {
    const candidate = overrides[key];
    if (candidate !== undefined && Number.isFinite(candidate)) {
      defaults[key] = Math.max(0, Math.floor(candidate));
    }
  }
  return defaults;
}

function emptyStats(): CalendarImportStats {
  return {
    sourceCount: 0,
    uncompressedBytes: 0,
    componentCount: 0,
    recurrenceIterations: 0,
    skippedEvents: 0,
    occurrenceCount: 0,
  };
}

function emptyResult(warnings: CalendarImportWarning[] = []): CalendarImportResult {
  return {
    ok: false,
    sources: [],
    occurrences: [],
    warnings,
    truncated: warnings.some((warning) => LIMIT_WARNING_CODES.has(warning.code)),
    stats: emptyStats(),
  };
}

function warning(
  code: CalendarImportWarning["code"],
  severity: CalendarImportWarning["severity"],
  message: string,
  details: { sourceFile?: string; eventUid?: string } = {},
): CalendarImportWarning {
  return { code, severity, message, ...details };
}

function parseCivilDate(value: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const normalized = new Date(Date.UTC(year, month - 1, day));
  if (
    normalized.getUTCFullYear() !== year ||
    normalized.getUTCMonth() !== month - 1 ||
    normalized.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function civilDateOrdinal(value: string): number | null {
  const parts = parseCivilDate(value);
  return parts
    ? Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_MS
    : null;
}

function formatLocalDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Creates a browser-local, DST-aware calendar window. All-day dates remain
 * civil dates instead of being converted to instants.
 */
export function createLocalCalendarWindow(
  startDate: string,
  days = CALENDAR_IMPORT_LIMITS.maxWindowDays,
): CalendarWindow {
  const parts = parseCivilDate(startDate);
  if (!parts || !Number.isInteger(days) || days < 1 || days > 7) {
    throw new RangeError("Calendar windows must contain one to seven valid civil days.");
  }

  const start = new Date(parts.year, parts.month - 1, parts.day);
  const end = new Date(parts.year, parts.month - 1, parts.day + days);
  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
    startDate,
    endDateExclusive: formatLocalDate(end),
  };
}

function validateWindow(
  window: CalendarWindow,
  maxDays: number,
): CalendarImportWarning | null {
  const startOrdinal = civilDateOrdinal(window.startDate);
  const endOrdinal = civilDateOrdinal(window.endDateExclusive);
  const civilDays =
    startOrdinal === null || endOrdinal === null ? NaN : endOrdinal - startOrdinal;

  if (
    !Number.isFinite(window.startMs) ||
    !Number.isFinite(window.endMs) ||
    window.endMs <= window.startMs ||
    !Number.isInteger(civilDays) ||
    civilDays < 1 ||
    civilDays > maxDays ||
    window.endMs - window.startMs > (maxDays * 24 + 2) * 60 * 60 * 1_000
  ) {
    return warning(
      "invalid-window",
      "error",
      `Choose a valid calendar window of no more than ${maxDays} days.`,
    );
  }
  return null;
}

function stableHash(value: string): string {
  let first = 0x811c9dc5;
  let second = 0x9e3779b9;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 0x01000193) >>> 0;
    second = Math.imul(second ^ code, 0x85ebca6b) >>> 0;
  }
  return `${first.toString(36).padStart(7, "0")}${second
    .toString(36)
    .padStart(7, "0")}`;
}

function textByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/^\uFEFF/, "") : "";
}

function fileStem(fileName: string): string {
  const leaf = fileName.split(/[\\/]/).pop() ?? fileName;
  const stem = leaf.replace(/\.ics$/i, "").trim();
  return stem || "Imported calendar";
}

function getFirstText(component: IcalComponent, propertyName: string): string {
  const value = component.getFirstPropertyValue(propertyName);
  return typeof value === "string" ? value : "";
}

function normalizeCalendarName(root: IcalComponent, fileName: string): string {
  const candidate = getFirstText(root, "x-wr-calname").trim() || fileStem(fileName);
  return candidate.slice(0, 200);
}

function readUid(component: IcalComponent): string {
  const candidate = getFirstText(component, "uid").trim();
  return candidate || `missing-${stableHash(component.toString())}`;
}

function readStatus(component: IcalComponent):
  | ImportedEventStatus
  | "cancelled" {
  switch (getFirstText(component, "status").toUpperCase()) {
    case "CANCELLED":
      return "cancelled";
    case "CONFIRMED":
      return "confirmed";
    case "TENTATIVE":
      return "tentative";
    default:
      return "unknown";
  }
}

function readTitle(
  event: IcalEvent,
  sourceFile: string,
  uid: string,
  limits: CalendarImportLimits,
  state: MutableImportState,
): string {
  const raw = typeof event.summary === "string" ? event.summary : "";
  const title = raw.trim() || "Untitled event";
  if (title.length <= limits.maxTitleCharacters) {
    return title;
  }

  state.warnings.push(
    warning(
      "title-truncated",
      "warning",
      `An unusually long event title was shortened to ${limits.maxTitleCharacters} characters.`,
      { sourceFile, eventUid: uid },
    ),
  );
  return title.slice(0, limits.maxTitleCharacters);
}

function sourceTimeZone(time: IcalTime): string | undefined {
  const tzid = time.zone?.tzid;
  return typeof tzid === "string" && tzid.length > 0 ? tzid : undefined;
}

function isAllDayOverlap(
  startDate: string,
  endDateExclusive: string,
  window: CalendarWindow,
): boolean {
  return startDate < window.endDateExclusive && endDateExclusive > window.startDate;
}

function isTimedOverlap(startMs: number, endMs: number, window: CalendarWindow): boolean {
  if (startMs === endMs) {
    return startMs >= window.startMs && startMs < window.endMs;
  }
  return startMs < window.endMs && endMs > window.startMs;
}

function addOccurrence(
  state: MutableImportState,
  occurrence: CalendarOccurrence,
  sourceFile: string,
  limits: CalendarImportLimits,
): void {
  if (state.occurrenceIds.has(occurrence.id)) {
    // Moved recurrence exceptions are intentionally inspected once directly
    // and once through their master series so exceptions outside the original
    // window can still move into it. Their stable ID makes that harmless.
    return;
  }

  if (state.occurrences.length >= limits.maxOccurrences) {
    state.truncated = true;
    if (!state.occurrenceLimitWarned) {
      state.occurrenceLimitWarned = true;
      state.warnings.push(
        warning(
          "occurrence-limit",
          "warning",
          `Only the first ${limits.maxOccurrences} occurrences in this snapshot were loaded.`,
          { sourceFile },
        ),
      );
    }
    return;
  }

  state.occurrenceIds.add(occurrence.id);
  state.occurrences.push(occurrence);
}

function normalizeOccurrence(
  event: IcalEvent,
  start: IcalTime,
  end: IcalTime,
  recurrenceId: string | undefined,
  source: CalendarSource,
  options: CalendarImportOptions,
  limits: CalendarImportLimits,
  state: MutableImportState,
): void {
  const status = readStatus(event.component);
  if (status === "cancelled") {
    state.stats.skippedEvents += 1;
    return;
  }

  const uid = readUid(event.component);
  const key = recurrenceId ?? start.toString();
  const id = `event-${stableHash(`${source.id}\u0000${uid}\u0000${key}`)}`;
  const title = readTitle(event, source.fileName, uid, limits, state);
  const tzid = sourceTimeZone(start);
  const common = {
    id,
    sourceId: source.id,
    calendarName: source.calendarName,
    uid,
    title,
    status,
    ...(recurrenceId ? { recurrenceId } : {}),
    ...(tzid ? { sourceTimeZone: tzid } : {}),
  };

  if (start.isDate) {
    const startDate = start.toString();
    const endDateExclusive = end.toString();
    if (
      civilDateOrdinal(startDate) === null ||
      civilDateOrdinal(endDateExclusive) === null ||
      endDateExclusive <= startDate
    ) {
      state.stats.skippedEvents += 1;
      state.warnings.push(
        warning(
          "invalid-event-time",
          "warning",
          "An event with an invalid all-day date range was ignored.",
          { sourceFile: source.fileName, eventUid: uid },
        ),
      );
      return;
    }

    if (!isAllDayOverlap(startDate, endDateExclusive, options.window)) {
      return;
    }

    const occurrence: AllDayCalendarOccurrence = {
      ...common,
      kind: "all-day",
      allDay: true,
      startDate,
      endDateExclusive,
    };
    addOccurrence(state, occurrence, source.fileName, limits);
    return;
  }

  try {
    const startMs = start.toJSDate().getTime();
    const endMs = end.toJSDate().getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) {
      throw new RangeError("Invalid event range");
    }
    if (!isTimedOverlap(startMs, endMs, options.window)) {
      return;
    }

    const occurrence: TimedCalendarOccurrence = {
      ...common,
      kind: "timed",
      allDay: false,
      startMs,
      endMs,
    };
    addOccurrence(state, occurrence, source.fileName, limits);
  } catch {
    state.stats.skippedEvents += 1;
    state.warnings.push(
      warning(
        "invalid-event-time",
        "warning",
        "An event with an invalid date or duration was ignored.",
        { sourceFile: source.fileName, eventUid: uid },
      ),
    );
  }
}

function componentTimezoneIds(component: IcalComponent): string[] {
  const ids = new Set<string>();
  for (const propertyName of [
    "dtstart",
    "dtend",
    "recurrence-id",
    "rdate",
    "exdate",
  ]) {
    for (const property of component.getAllProperties(propertyName)) {
      const tzid = property.getFirstParameter("tzid");
      if (typeof tzid === "string" && tzid.trim()) {
        ids.add(tzid.trim());
      }
    }
  }
  return [...ids];
}

function findUnsupportedTimezone(
  component: IcalComponent,
  root: IcalComponent,
): string | null {
  for (const tzid of componentTimezoneIds(component)) {
    if (UTC_TZIDS.has(tzid)) {
      continue;
    }
    try {
      if (root.getTimeZoneByID(tzid)) {
        continue;
      }
    } catch {
      return tzid;
    }
    return tzid;
  }
  return null;
}

function findUnsupportedFrequency(component: IcalComponent): string | null {
  for (const property of component.getAllProperties("rrule")) {
    const value: unknown = property.getFirstValue();
    if (typeof value === "object" && value !== null && "freq" in value) {
      const frequency = String((value as { freq: unknown }).freq).toUpperCase();
      if (UNSUPPORTED_FREQUENCIES.has(frequency)) {
        return frequency;
      }
    }
  }
  return null;
}

function occurrenceAnchorPastWindow(
  occurrence: IcalTime,
  window: CalendarWindow,
): boolean {
  if (occurrence.isDate) {
    return occurrence.toString() >= window.endDateExclusive;
  }
  try {
    return occurrence.toJSDate().getTime() >= window.endMs;
  } catch {
    return false;
  }
}

function processRecurringEvent(
  event: IcalEvent,
  source: CalendarSource,
  options: CalendarImportOptions,
  limits: CalendarImportLimits,
  state: MutableImportState,
): void {
  let iterator;
  try {
    // Passing the display-window start to Event.iterator() changes DTSTART; it
    // does not seek. Always preserve the series' real recurrence anchor.
    iterator = event.iterator();
  } catch {
    state.stats.skippedEvents += 1;
    state.warnings.push(
      warning(
        "invalid-event-time",
        "warning",
        "A recurring event could not be expanded and was ignored.",
        { sourceFile: source.fileName, eventUid: readUid(event.component) },
      ),
    );
    return;
  }

  let finished = false;
  let passedWindow = false;
  let iterations = 0;
  try {
    while (iterations < limits.maxRecurrenceIterationsPerSeries) {
      const next = iterator.next();
      if (!next) {
        finished = true;
        break;
      }

      iterations += 1;
      state.stats.recurrenceIterations += 1;
      if (occurrenceAnchorPastWindow(next, options.window)) {
        passedWindow = true;
        break;
      }

      const details = event.getOccurrenceDetails(next);
      normalizeOccurrence(
        details.item,
        details.startDate,
        details.endDate,
        details.recurrenceId.toString(),
        source,
        options,
        limits,
        state,
      );

      if (state.occurrenceLimitWarned) {
        break;
      }
    }
  } catch {
    state.stats.skippedEvents += 1;
    state.warnings.push(
      warning(
        "invalid-event-time",
        "warning",
        "A malformed recurrence was stopped without affecting other events.",
        { sourceFile: source.fileName, eventUid: readUid(event.component) },
      ),
    );
    return;
  }

  if (
    !finished &&
    !passedWindow &&
    iterations >= limits.maxRecurrenceIterationsPerSeries
  ) {
    state.truncated = true;
    state.warnings.push(
      warning(
        "recurrence-truncated",
        "warning",
        `A recurrence was stopped after ${limits.maxRecurrenceIterationsPerSeries} iterations.`,
        { sourceFile: source.fileName, eventUid: readUid(event.component) },
      ),
    );
  }
}

function occurrenceSortValue(occurrence: CalendarOccurrence): number {
  if (occurrence.kind === "timed") {
    return occurrence.startMs;
  }
  return Date.parse(`${occurrence.startDate}T00:00:00Z`) - DAY_MS;
}

function sortOccurrences(occurrences: CalendarOccurrence[]): CalendarOccurrence[] {
  return [...occurrences].sort((left, right) => {
    const timeDifference = occurrenceSortValue(left) - occurrenceSortValue(right);
    if (timeDifference !== 0) {
      return timeDifference;
    }
    return left.id.localeCompare(right.id);
  });
}

function isCalendarComponent(root: IcalComponent): boolean {
  return root.name === "vcalendar";
}

export function importIcsText(
  input: IcsTextInput,
  options: CalendarImportOptions,
): CalendarImportResult {
  const limits = mergeLimits(options.limits);
  const invalidWindow = validateWindow(options.window, limits.maxWindowDays);
  if (invalidWindow) {
    return emptyResult([invalidWindow]);
  }

  if (limits.maxSourceFiles < 1) {
    return emptyResult([
      warning("source-limit", "error", "No more calendar sources can be loaded."),
    ]);
  }

  const text = cleanText(input.text);
  const byteLength = textByteLength(text);
  if (byteLength > limits.maxUncompressedBytes) {
    return emptyResult([
      warning(
        "uncompressed-limit",
        "error",
        `Calendar text must be no larger than ${limits.maxUncompressedBytes} bytes.`,
        { sourceFile: input.fileName },
      ),
    ]);
  }

  let root: IcalComponent;
  try {
    root = new ICAL.Component(ICAL.parse(text));
    if (!isCalendarComponent(root)) {
      throw new Error("The root component is not VCALENDAR");
    }
  } catch {
    return emptyResult([
      warning(
        "malformed-ics",
        "error",
        "This calendar file could not be read. Other loaded snapshots were left unchanged.",
        { sourceFile: input.fileName },
      ),
    ]);
  }

  const snapshotId = `snapshot-${stableHash(text)}`;
  const sourceId = input.sourceId ?? `source-${stableHash(`${input.fileName}\u0000${text}`)}`;
  const source: CalendarSource = {
    id: sourceId,
    snapshotId,
    fileName: input.fileName,
    calendarName: normalizeCalendarName(root, input.fileName),
    kind: input.kind ?? "ics",
    ...(input.archiveName ? { archiveName: input.archiveName } : {}),
  };

  const state: MutableImportState = {
    occurrences: [],
    occurrenceIds: new Set(),
    warnings: [],
    stats: {
      ...emptyStats(),
      sourceCount: 1,
      uncompressedBytes: byteLength,
    },
    truncated: false,
    occurrenceLimitWarned: false,
  };

  const allComponents = root.getAllSubcomponents("vevent");
  state.stats.componentCount = Math.min(
    allComponents.length,
    limits.maxCalendarComponents,
  );
  const components = allComponents.slice(0, limits.maxCalendarComponents);
  if (allComponents.length > limits.maxCalendarComponents) {
    state.truncated = true;
    state.warnings.push(
      warning(
        "component-limit",
        "warning",
        `Only the first ${limits.maxCalendarComponents} event records were inspected.`,
        { sourceFile: source.fileName },
      ),
    );
  }

  const uidByComponent = new Map<IcalComponent, string>();
  const invalidUids = new Set<string>();
  for (const component of components) {
    const uid = readUid(component);
    uidByComponent.set(component, uid);

    const unsupportedTimezone = findUnsupportedTimezone(component, root);
    if (unsupportedTimezone) {
      invalidUids.add(uid);
      state.warnings.push(
        warning(
          "unsupported-timezone",
          "warning",
          `An event using ${unsupportedTimezone} was ignored because the file did not include that time zone definition.`,
          { sourceFile: source.fileName, eventUid: uid },
        ),
      );
    }

    const unsupportedFrequency = findUnsupportedFrequency(component);
    if (unsupportedFrequency) {
      invalidUids.add(uid);
      state.warnings.push(
        warning(
          "unsupported-recurrence",
          "warning",
          `${unsupportedFrequency.toLowerCase()} recurrence is not supported in a day-planning snapshot.`,
          { sourceFile: source.fileName, eventUid: uid },
        ),
      );
    }
  }

  const exceptionsByUid = new Map<string, IcalComponent[]>();
  const masters: IcalComponent[] = [];
  const exceptions: IcalComponent[] = [];
  for (const component of components) {
    const uid = uidByComponent.get(component) ?? readUid(component);
    if (component.hasProperty("recurrence-id")) {
      exceptions.push(component);
      const related = exceptionsByUid.get(uid) ?? [];
      related.push(component);
      exceptionsByUid.set(uid, related);
    } else {
      masters.push(component);
    }
  }

  // Process moved exceptions directly as well. This preserves an exception
  // moved into the window even when its original recurrence-id lies outside it.
  for (const component of exceptions) {
    const uid = uidByComponent.get(component) ?? readUid(component);
    if (invalidUids.has(uid)) {
      state.stats.skippedEvents += 1;
      continue;
    }
    try {
      const event = new ICAL.Event(component);
      const recurrenceId = event.recurrenceId?.toString();
      if (!event.startDate) {
        throw new Error("Missing DTSTART");
      }
      normalizeOccurrence(
        event,
        event.startDate,
        event.endDate,
        recurrenceId,
        source,
        options,
        limits,
        state,
      );
    } catch {
      state.stats.skippedEvents += 1;
      state.warnings.push(
        warning(
          "missing-event-start",
          "warning",
          "An event without a readable start time was ignored.",
          { sourceFile: source.fileName, eventUid: uid },
        ),
      );
    }
  }

  for (const component of masters) {
    const uid = uidByComponent.get(component) ?? readUid(component);
    if (invalidUids.has(uid)) {
      state.stats.skippedEvents += 1;
      continue;
    }
    if (readStatus(component) === "cancelled") {
      state.stats.skippedEvents += 1;
      continue;
    }

    try {
      const event = new ICAL.Event(component, {
        strictExceptions: true,
        exceptions: exceptionsByUid.get(uid) ?? [],
      });
      if (!event.startDate) {
        throw new Error("Missing DTSTART");
      }
      if (event.isRecurring()) {
        processRecurringEvent(event, source, options, limits, state);
      } else {
        normalizeOccurrence(
          event,
          event.startDate,
          event.endDate,
          undefined,
          source,
          options,
          limits,
          state,
        );
      }
    } catch {
      state.stats.skippedEvents += 1;
      state.warnings.push(
        warning(
          "missing-event-start",
          "warning",
          "An event without a readable start time was ignored.",
          { sourceFile: source.fileName, eventUid: uid },
        ),
      );
    }

    if (state.occurrenceLimitWarned) {
      break;
    }
  }

  const occurrences = sortOccurrences(state.occurrences);
  state.stats.occurrenceCount = occurrences.length;
  return {
    ok: true,
    sources: [source],
    occurrences,
    warnings: state.warnings,
    truncated: state.truncated,
    stats: state.stats,
  };
}

function isZipBytes(bytes: Uint8Array): boolean {
  if (bytes.byteLength < 4) {
    return false;
  }
  return (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    ((bytes[2] === 0x03 && bytes[3] === 0x04) ||
      (bytes[2] === 0x05 && bytes[3] === 0x06) ||
      (bytes[2] === 0x07 && bytes[3] === 0x08))
  );
}

function decodeCalendarBytes(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes).replace(/^\uFEFF/, "");
}

export function importCalendarZip(
  input: CalendarBytesInput,
  options: CalendarImportOptions,
): CalendarImportResult {
  const limits = mergeLimits(options.limits);
  const invalidWindow = validateWindow(options.window, limits.maxWindowDays);
  if (invalidWindow) {
    return emptyResult([invalidWindow]);
  }
  if (input.bytes.byteLength > limits.maxCompressedBytes) {
    return emptyResult([
      warning(
        "input-too-large",
        "error",
        `ZIP snapshots must be no larger than ${limits.maxCompressedBytes} bytes.`,
        { sourceFile: input.fileName },
      ),
    ]);
  }
  if (!isZipBytes(input.bytes)) {
    return emptyResult([
      warning("invalid-zip", "error", "This ZIP snapshot could not be read.", {
        sourceFile: input.fileName,
      }),
    ]);
  }

  const zipWarnings: CalendarImportWarning[] = [];
  let seenEntries = 0;
  let selectedSources = 0;
  let declaredUncompressedBytes = 0;
  let reachedEntryLimit = false;
  let reachedSourceLimit = false;
  let reachedUncompressedLimit = false;
  let extracted: Record<string, Uint8Array>;

  try {
    extracted = unzipSync(input.bytes, {
      filter(file) {
        seenEntries += 1;
        if (seenEntries > limits.maxZipEntries) {
          reachedEntryLimit = true;
          return false;
        }
        if (!file.name.toLowerCase().endsWith(".ics")) {
          return false;
        }
        if (file.compression !== 0 && file.compression !== 8) {
          zipWarnings.push(
            warning(
              "unsupported-zip-entry",
              "warning",
              `The ZIP entry ${file.name} uses an unsupported compression method.`,
              { sourceFile: input.fileName },
            ),
          );
          return false;
        }
        if (selectedSources >= limits.maxSourceFiles) {
          reachedSourceLimit = true;
          return false;
        }
        if (
          file.originalSize > limits.maxUncompressedBytes ||
          declaredUncompressedBytes + file.originalSize > limits.maxUncompressedBytes
        ) {
          reachedUncompressedLimit = true;
          return false;
        }

        selectedSources += 1;
        declaredUncompressedBytes += file.originalSize;
        return true;
      },
    });
  } catch {
    return emptyResult([
      ...zipWarnings,
      warning(
        "invalid-zip",
        "error",
        "This ZIP snapshot is malformed, encrypted, or uses unsupported compression.",
        { sourceFile: input.fileName },
      ),
    ]);
  }

  if (reachedEntryLimit) {
    zipWarnings.push(
      warning(
        "zip-entry-limit",
        "warning",
        `Only the first ${limits.maxZipEntries} ZIP entries were inspected.`,
        { sourceFile: input.fileName },
      ),
    );
  }
  if (reachedSourceLimit) {
    zipWarnings.push(
      warning(
        "source-limit",
        "warning",
        `Only the first ${limits.maxSourceFiles} calendar files were loaded.`,
        { sourceFile: input.fileName },
      ),
    );
  }
  if (reachedUncompressedLimit) {
    zipWarnings.push(
      warning(
        "uncompressed-limit",
        "warning",
        `Calendar text beyond ${limits.maxUncompressedBytes} bytes was not expanded.`,
        { sourceFile: input.fileName },
      ),
    );
  }

  const entries = Object.entries(extracted)
    .filter(([name]) => name.toLowerCase().endsWith(".ics"))
    .sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) {
    return emptyResult([
      ...zipWarnings,
      warning(
        "no-calendar-files",
        "error",
        "No readable .ics calendar files were found in this ZIP snapshot.",
        { sourceFile: input.fileName },
      ),
    ]);
  }

  const aggregate: CalendarImportResult = {
    ok: false,
    sources: [],
    occurrences: [],
    warnings: [...zipWarnings],
    truncated: zipWarnings.some((item) => LIMIT_WARNING_CODES.has(item.code)),
    stats: emptyStats(),
  };
  const ids = new Set<string>();

  for (const [entryName, bytes] of entries) {
    const actualRemainingBytes = limits.maxUncompressedBytes - aggregate.stats.uncompressedBytes;
    const sourceRemaining = limits.maxSourceFiles - aggregate.sources.length;
    const occurrenceRemaining = limits.maxOccurrences - aggregate.occurrences.length;
    const componentRemaining =
      limits.maxCalendarComponents - aggregate.stats.componentCount;
    if (actualRemainingBytes < bytes.byteLength || sourceRemaining <= 0) {
      aggregate.truncated = true;
      break;
    }

    const text = decodeCalendarBytes(bytes);
    const result = importIcsText(
      {
        text,
        fileName: entryName,
        sourceId: `source-${stableHash(
          `${input.fileName}\u0000${entryName}\u0000${text}`,
        )}`,
        kind: "zip-entry",
        archiveName: input.fileName,
      },
      {
        window: options.window,
        limits: {
          ...limits,
          maxSourceFiles: sourceRemaining,
          maxUncompressedBytes: actualRemainingBytes,
          maxOccurrences: occurrenceRemaining,
          maxCalendarComponents: componentRemaining,
        },
      },
    );

    aggregate.ok ||= result.ok;
    aggregate.sources.push(...result.sources);
    aggregate.warnings.push(...result.warnings);
    aggregate.truncated ||= result.truncated;
    aggregate.stats.sourceCount += result.stats.sourceCount;
    aggregate.stats.uncompressedBytes += result.stats.uncompressedBytes;
    aggregate.stats.componentCount += result.stats.componentCount;
    aggregate.stats.recurrenceIterations += result.stats.recurrenceIterations;
    aggregate.stats.skippedEvents += result.stats.skippedEvents;
    for (const occurrence of result.occurrences) {
      if (!ids.has(occurrence.id) && aggregate.occurrences.length < limits.maxOccurrences) {
        ids.add(occurrence.id);
        aggregate.occurrences.push(occurrence);
      }
    }
  }

  aggregate.occurrences = sortOccurrences(aggregate.occurrences);
  aggregate.stats.occurrenceCount = aggregate.occurrences.length;
  return aggregate;
}

export function importCalendarBytes(
  input: CalendarBytesInput,
  options: CalendarImportOptions,
): CalendarImportResult {
  const lowerName = input.fileName.toLowerCase();
  if (isZipBytes(input.bytes) || lowerName.endsWith(".zip")) {
    return importCalendarZip(input, options);
  }

  const limits = mergeLimits(options.limits);
  if (input.bytes.byteLength > limits.maxUncompressedBytes) {
    return emptyResult([
      warning(
        "uncompressed-limit",
        "error",
        `Calendar text must be no larger than ${limits.maxUncompressedBytes} bytes.`,
        { sourceFile: input.fileName },
      ),
    ]);
  }
  return importIcsText(
    { text: decodeCalendarBytes(input.bytes), fileName: input.fileName },
    options,
  );
}

/** Imports a picker/drop batch while enforcing aggregate input limits. */
export function importCalendarFiles(
  inputs: CalendarBytesInput[],
  options: CalendarImportOptions,
): CalendarImportResult {
  const limits = mergeLimits(options.limits);
  const invalidWindow = validateWindow(options.window, limits.maxWindowDays);
  if (invalidWindow) {
    return emptyResult([invalidWindow]);
  }
  if (inputs.length === 0) {
    return emptyResult([
      warning("no-calendar-files", "error", "Choose at least one calendar file."),
    ]);
  }

  const aggregateCompressedBytes = inputs.reduce(
    (total, input) => total + input.bytes.byteLength,
    0,
  );
  if (aggregateCompressedBytes > limits.maxCompressedBytes) {
    return emptyResult([
      warning(
        "input-too-large",
        "error",
        `Selected files must total no more than ${limits.maxCompressedBytes} bytes.`,
      ),
    ]);
  }

  const aggregate: CalendarImportResult = {
    ok: false,
    sources: [],
    occurrences: [],
    warnings: [],
    truncated: false,
    stats: emptyStats(),
  };
  const occurrenceIds = new Set<string>();

  for (const input of inputs) {
    const remainingSources = limits.maxSourceFiles - aggregate.sources.length;
    const remainingUncompressed =
      limits.maxUncompressedBytes - aggregate.stats.uncompressedBytes;
    const remainingComponents =
      limits.maxCalendarComponents - aggregate.stats.componentCount;
    const remainingOccurrences = limits.maxOccurrences - aggregate.occurrences.length;
    if (remainingSources <= 0) {
      aggregate.truncated = true;
      aggregate.warnings.push(
        warning(
          "source-limit",
          "warning",
          `Only the first ${limits.maxSourceFiles} calendar sources were loaded.`,
        ),
      );
      break;
    }

    const result = importCalendarBytes(input, {
      window: options.window,
      limits: {
        ...limits,
        maxSourceFiles: remainingSources,
        maxUncompressedBytes: remainingUncompressed,
        maxCalendarComponents: remainingComponents,
        maxOccurrences: remainingOccurrences,
      },
    });
    aggregate.ok ||= result.ok;
    aggregate.sources.push(...result.sources);
    aggregate.warnings.push(...result.warnings);
    aggregate.truncated ||= result.truncated;
    aggregate.stats.sourceCount += result.stats.sourceCount;
    aggregate.stats.uncompressedBytes += result.stats.uncompressedBytes;
    aggregate.stats.componentCount += result.stats.componentCount;
    aggregate.stats.recurrenceIterations += result.stats.recurrenceIterations;
    aggregate.stats.skippedEvents += result.stats.skippedEvents;
    for (const occurrence of result.occurrences) {
      if (
        !occurrenceIds.has(occurrence.id) &&
        aggregate.occurrences.length < limits.maxOccurrences
      ) {
        occurrenceIds.add(occurrence.id);
        aggregate.occurrences.push(occurrence);
      }
    }
  }

  aggregate.occurrences = sortOccurrences(aggregate.occurrences);
  aggregate.stats.occurrenceCount = aggregate.occurrences.length;
  return aggregate;
}
