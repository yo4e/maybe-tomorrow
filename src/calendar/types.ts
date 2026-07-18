export const CALENDAR_IMPORT_LIMITS = {
  maxSourceFiles: 10,
  maxCompressedBytes: 5 * 1024 * 1024,
  maxUncompressedBytes: 20 * 1024 * 1024,
  maxZipEntries: 128,
  maxCalendarComponents: 5_000,
  maxOccurrences: 2_000,
  maxRecurrenceIterationsPerSeries: 10_000,
  maxWindowDays: 7,
  maxTitleCharacters: 500,
} as const;

export type CalendarImportLimits = {
  maxSourceFiles: number;
  maxCompressedBytes: number;
  maxUncompressedBytes: number;
  maxZipEntries: number;
  maxCalendarComponents: number;
  maxOccurrences: number;
  maxRecurrenceIterationsPerSeries: number;
  maxWindowDays: number;
  maxTitleCharacters: number;
};

export type CalendarWindow = {
  /** Inclusive instant at the beginning of the display window. */
  startMs: number;
  /** Exclusive instant at the end of the display window. */
  endMs: number;
  /** Inclusive civil date used for all-day events (`YYYY-MM-DD`). */
  startDate: string;
  /** Exclusive civil date used for all-day events (`YYYY-MM-DD`). */
  endDateExclusive: string;
};

export type CalendarSourceKind = "ics" | "zip-entry" | "demo";

export type CalendarSource = {
  id: string;
  snapshotId: string;
  fileName: string;
  calendarName: string;
  kind: CalendarSourceKind;
  archiveName?: string;
};

export type ImportedEventStatus = "confirmed" | "tentative" | "unknown";

type ImportedOccurrenceBase = {
  id: string;
  sourceId: string;
  calendarName: string;
  uid: string;
  title: string;
  status: ImportedEventStatus;
  recurrenceId?: string;
  sourceTimeZone?: string;
};

export type TimedCalendarOccurrence = ImportedOccurrenceBase & {
  kind: "timed";
  allDay: false;
  startMs: number;
  endMs: number;
};

export type AllDayCalendarOccurrence = ImportedOccurrenceBase & {
  kind: "all-day";
  allDay: true;
  startDate: string;
  /** RFC 5545 all-day `DTEND` is exclusive. */
  endDateExclusive: string;
};

export type CalendarOccurrence =
  | TimedCalendarOccurrence
  | AllDayCalendarOccurrence;

export type CalendarImportWarningCode =
  | "invalid-window"
  | "input-too-large"
  | "invalid-zip"
  | "zip-entry-limit"
  | "source-limit"
  | "uncompressed-limit"
  | "unsupported-zip-entry"
  | "no-calendar-files"
  | "malformed-ics"
  | "component-limit"
  | "missing-event-start"
  | "invalid-event-time"
  | "unsupported-timezone"
  | "unsupported-recurrence"
  | "recurrence-truncated"
  | "occurrence-limit"
  | "title-truncated"
  | "duplicate-occurrence";

export type CalendarImportWarning = {
  code: CalendarImportWarningCode;
  severity: "warning" | "error";
  message: string;
  sourceFile?: string;
  eventUid?: string;
};

export type CalendarImportStats = {
  sourceCount: number;
  uncompressedBytes: number;
  componentCount: number;
  recurrenceIterations: number;
  skippedEvents: number;
  occurrenceCount: number;
};

export type CalendarImportResult = {
  ok: boolean;
  sources: CalendarSource[];
  occurrences: CalendarOccurrence[];
  warnings: CalendarImportWarning[];
  truncated: boolean;
  stats: CalendarImportStats;
};

export type IcsTextInput = {
  text: string;
  fileName: string;
  sourceId?: string;
  kind?: CalendarSourceKind;
  archiveName?: string;
};

export type CalendarBytesInput = {
  bytes: Uint8Array;
  fileName: string;
};

export type CalendarImportOptions = {
  window: CalendarWindow;
  limits?: Partial<CalendarImportLimits>;
};

export type EventClassification = {
  fixed: boolean;
  movable: boolean;
  reducible: boolean;
  highEnergy: boolean;
  recovery: boolean;
};
