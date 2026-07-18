import type { Decision } from "../domain/types";
import {
  HISTORY_KEY,
  isDecision,
  type StorageLike,
  type StorageResult,
  type StorageWarning,
} from "./history";

export const JOURNAL_KEY = "maybe-tomorrow:journal:v2";
export const JOURNAL_LIMIT = 50;

export type JournalKind = "quick-check" | "day-plan";

export type JournalDayMetrics = {
  eventCount: number;
  occupiedMinutes: number;
  freeMinutes: number;
  overlapMinutes: number;
  fragmentedGapCount: number;
  protectedRecoveryMinutes: number;
};

export type JournalSelectedPlan = {
  summary: string;
  operations: string[];
};

export type JournalDayContext = {
  snapshotId: string;
  snapshotName: string;
  selectedDate: string;
  metrics: JournalDayMetrics;
  candidateMinutes: number;
  selectedPlan?: JournalSelectedPlan;
};

type JournalEntryBase = {
  version: 2;
  id: string;
  savedAt: string;
  decision: Decision;
};

export type QuickCheckJournalEntry = JournalEntryBase & {
  kind: "quick-check";
  dayContext?: never;
};

export type DayPlanJournalEntry = JournalEntryBase & {
  kind: "day-plan";
  dayContext: JournalDayContext;
};

export type JournalEntry = QuickCheckJournalEntry | DayPlanJournalEntry;

export type { StorageLike, StorageResult, StorageWarning } from "./history";

const MAX_ID_LENGTH = 200;
const MAX_SNAPSHOT_NAME_LENGTH = 200;
const MAX_PLAN_SUMMARY_LENGTH = 500;
const MAX_PLAN_OPERATION_LENGTH = 300;
const MAX_PLAN_OPERATIONS = 20;
const MAX_METRIC_VALUE = 100_000;
const MIN_CANDIDATE_MINUTES = 1;
const MAX_CANDIDATE_MINUTES = 1_440;

function resolveStorage(storage?: StorageLike): StorageLike | undefined {
  if (storage) {
    return storage;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBoundedString(
  value: unknown,
  maximumLength: number,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximumLength
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return (
    Number.isInteger(value) &&
    Number(value) >= 0 &&
    Number(value) <= MAX_METRIC_VALUE
  );
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function normalizeDecision(value: unknown): Decision | null {
  if (!isDecision(value)) {
    return null;
  }

  return {
    id: value.id,
    activity: value.activity,
    inputs: {
      urgency: value.inputs.urgency,
      commitment: value.inputs.commitment,
      desire: value.inputs.desire,
      energyCost: value.inputs.energyCost,
      dayLoad: value.inputs.dayLoad,
      recoveryNeed: value.inputs.recoveryNeed,
      tomorrowFlexibility: value.inputs.tomorrowFlexibility,
      shrinkable: value.inputs.shrinkable,
    },
    score: value.score,
    verdict: value.verdict,
    factors: [...value.factors],
    createdAt: value.createdAt,
  };
}

function normalizeMetrics(value: unknown): JournalDayMetrics | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isNonNegativeInteger(value.eventCount) ||
    !isNonNegativeInteger(value.occupiedMinutes) ||
    !isNonNegativeInteger(value.freeMinutes) ||
    !isNonNegativeInteger(value.overlapMinutes) ||
    !isNonNegativeInteger(value.fragmentedGapCount) ||
    !isNonNegativeInteger(value.protectedRecoveryMinutes)
  ) {
    return null;
  }

  return {
    eventCount: value.eventCount,
    occupiedMinutes: value.occupiedMinutes,
    freeMinutes: value.freeMinutes,
    overlapMinutes: value.overlapMinutes,
    fragmentedGapCount: value.fragmentedGapCount,
    protectedRecoveryMinutes: value.protectedRecoveryMinutes,
  };
}

function normalizeSelectedPlan(value: unknown): JournalSelectedPlan | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isBoundedString(value.summary, MAX_PLAN_SUMMARY_LENGTH) ||
    !Array.isArray(value.operations) ||
    value.operations.length > MAX_PLAN_OPERATIONS ||
    !value.operations.every((operation) =>
      isBoundedString(operation, MAX_PLAN_OPERATION_LENGTH),
    )
  ) {
    return null;
  }

  return {
    summary: value.summary,
    operations: [...value.operations],
  };
}

function normalizeDayContext(value: unknown): JournalDayContext | null {
  if (!isRecord(value)) {
    return null;
  }

  const metrics = normalizeMetrics(value.metrics);
  if (
    !isBoundedString(value.snapshotId, MAX_ID_LENGTH) ||
    !isBoundedString(value.snapshotName, MAX_SNAPSHOT_NAME_LENGTH) ||
    !isIsoDate(value.selectedDate) ||
    !metrics ||
    !Number.isInteger(value.candidateMinutes) ||
    Number(value.candidateMinutes) < MIN_CANDIDATE_MINUTES ||
    Number(value.candidateMinutes) > MAX_CANDIDATE_MINUTES
  ) {
    return null;
  }

  const normalized: JournalDayContext = {
    snapshotId: value.snapshotId,
    snapshotName: value.snapshotName,
    selectedDate: value.selectedDate,
    metrics,
    candidateMinutes: Number(value.candidateMinutes),
  };

  if (value.selectedPlan !== undefined) {
    const selectedPlan = normalizeSelectedPlan(value.selectedPlan);
    if (!selectedPlan) {
      return null;
    }
    normalized.selectedPlan = selectedPlan;
  }

  return normalized;
}

function normalizeJournalEntry(value: unknown): JournalEntry | null {
  if (!isRecord(value)) {
    return null;
  }

  const decision = normalizeDecision(value.decision);
  if (
    value.version !== 2 ||
    !isBoundedString(value.id, MAX_ID_LENGTH) ||
    !isIsoTimestamp(value.savedAt) ||
    !decision
  ) {
    return null;
  }

  const base: JournalEntryBase = {
    version: 2,
    id: value.id,
    savedAt: value.savedAt,
    decision,
  };

  if (value.kind === "quick-check") {
    return { ...base, kind: "quick-check" };
  }

  if (value.kind === "day-plan") {
    const dayContext = normalizeDayContext(value.dayContext);
    return dayContext ? { ...base, kind: "day-plan", dayContext } : null;
  }

  return null;
}

export function isJournalEntry(value: unknown): value is JournalEntry {
  return normalizeJournalEntry(value) !== null;
}

function sortNewestFirst(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => {
    const timeDifference = Date.parse(b.savedAt) - Date.parse(a.savedAt);
    return timeDifference || a.id.localeCompare(b.id);
  });
}

function normalizeEntries(value: unknown): {
  entries: JournalEntry[];
  malformed: boolean;
} {
  if (!Array.isArray(value)) {
    return { entries: [], malformed: true };
  }

  const normalized = value
    .map(normalizeJournalEntry)
    .filter((entry): entry is JournalEntry => entry !== null);

  return {
    entries: sortNewestFirst(normalized).slice(0, JOURNAL_LIMIT),
    malformed: normalized.length !== value.length,
  };
}

function migratedEntry(decision: Decision): QuickCheckJournalEntry {
  const normalizedDecision = normalizeDecision(decision);
  if (!normalizedDecision) {
    throw new TypeError("A migrated decision must be valid.");
  }

  return {
    version: 2,
    kind: "quick-check",
    id: normalizedDecision.id,
    savedAt: normalizedDecision.createdAt,
    decision: normalizedDecision,
  };
}

function withWarning<T>(
  value: T,
  warning?: StorageWarning,
): StorageResult<T> {
  return warning ? { ok: true, value, warning } : { ok: true, value };
}

function removeLegacyAfterWrite(storage: StorageLike): void {
  try {
    storage.removeItem(HISTORY_KEY);
  } catch {
    // The v2 write already succeeded. Keeping a stale v1 backup is harmless
    // because the v2 key always takes precedence.
  }
}

function migrateLegacyHistory(
  storage: StorageLike,
): StorageResult<JournalEntry[]> {
  let parsed: unknown;
  let malformed = false;

  try {
    const raw = storage.getItem(HISTORY_KEY);
    if (raw === null) {
      return { ok: true, value: [] };
    }
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
      parsed = [];
      malformed = true;
    }
  } catch {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const legacyItems: unknown[] = Array.isArray(parsed) ? parsed : [];
  if (!Array.isArray(parsed)) {
    malformed = true;
  }

  const decisions = legacyItems.filter(isDecision);
  if (decisions.length !== legacyItems.length) {
    malformed = true;
  }

  const entries = sortNewestFirst(decisions.map(migratedEntry)).slice(
    0,
    JOURNAL_LIMIT,
  );

  try {
    storage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  } catch {
    return { ok: false, value: entries, warning: "unavailable" };
  }

  removeLegacyAfterWrite(storage);
  return withWarning(entries, malformed ? "malformed" : undefined);
}

export function loadJournal(
  storage?: StorageLike,
): StorageResult<JournalEntry[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  let raw: string | null;
  try {
    raw = target.getItem(JOURNAL_KEY);
  } catch {
    return { ok: false, value: [], warning: "unavailable" };
  }

  if (raw === null) {
    return migrateLegacyHistory(target);
  }

  try {
    const result = normalizeEntries(JSON.parse(raw) as unknown);
    return withWarning(result.entries, result.malformed ? "malformed" : undefined);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { ok: true, value: [], warning: "malformed" };
    }
    return { ok: false, value: [], warning: "unavailable" };
  }
}

export function saveJournal(
  entries: readonly JournalEntry[],
  storage?: StorageLike,
): StorageResult<JournalEntry[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const normalized = normalizeEntries(entries);
  try {
    target.setItem(JOURNAL_KEY, JSON.stringify(normalized.entries));
  } catch {
    return { ok: false, value: normalized.entries, warning: "unavailable" };
  }

  removeLegacyAfterWrite(target);
  return withWarning(
    normalized.entries,
    normalized.malformed ? "malformed" : undefined,
  );
}

export function addJournalEntry(
  entry: JournalEntry,
  storage?: StorageLike,
): StorageResult<JournalEntry[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const normalizedEntry = normalizeJournalEntry(entry);
  const existing = loadJournal(target);
  if (!existing.ok) {
    return existing;
  }
  if (!normalizedEntry) {
    return { ok: false, value: existing.value, warning: "malformed" };
  }

  const result = saveJournal(
    [
      normalizedEntry,
      ...existing.value.filter((item) => item.id !== normalizedEntry.id),
    ],
    target,
  );

  if (result.ok && existing.warning && !result.warning) {
    return { ...result, warning: existing.warning };
  }
  return result;
}

export function deleteJournalEntry(
  id: string,
  storage?: StorageLike,
): StorageResult<JournalEntry[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const existing = loadJournal(target);
  if (!existing.ok) {
    return existing;
  }

  const result = saveJournal(
    existing.value.filter((entry) => entry.id !== id),
    target,
  );
  if (result.ok && existing.warning && !result.warning) {
    return { ...result, warning: existing.warning };
  }
  return result;
}

export function clearJournal(
  storage?: StorageLike,
): StorageResult<JournalEntry[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const existing = loadJournal(target);
  if (!existing.ok) {
    return existing;
  }

  try {
    // A durable empty v2 journal prevents a stale v1 key from being migrated
    // again if legacy-key cleanup is unavailable.
    target.setItem(JOURNAL_KEY, "[]");
  } catch {
    return { ok: false, value: existing.value, warning: "unavailable" };
  }

  removeLegacyAfterWrite(target);
  return { ok: true, value: [] };
}
