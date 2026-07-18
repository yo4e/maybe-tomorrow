import type {
  CalendarOccurrence,
  CalendarWindow,
  EventClassification,
  TimedCalendarOccurrence,
} from "./types";

export type ClassificationMap = Record<string, EventClassification>;

export type OpenInterval = {
  startMs: number;
  endMs: number;
  minutes: number;
};

export type DayMetrics = {
  eventCount: number;
  timedEventCount: number;
  allDayEventCount: number;
  scheduledMinutes: number;
  occupiedMinutes: number;
  freeMinutes: number;
  longestOpenMinutes: number;
  overlapMinutes: number;
  fragmentedGapCount: number;
  protectedRecoveryMinutes: number;
  fixedCount: number;
  movableCount: number;
  reducibleCount: number;
  highEnergyCount: number;
  recoveryCount: number;
  pressure: "gentle" | "full" | "overfull";
  openIntervals: OpenInterval[];
};

export const EMPTY_CLASSIFICATION: EventClassification = {
  fixed: false,
  movable: false,
  reducible: false,
  highEnergy: false,
  recovery: false,
};

function parseCivilDate(value: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError("Date must use YYYY-MM-DD.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(year, month - 1, day);
  if (
    check.getFullYear() !== year ||
    check.getMonth() !== month - 1 ||
    check.getDate() !== day
  ) {
    throw new RangeError("Date must be a real civil date.");
  }
  return [year, month, day];
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addCivilDays(value: string, amount: number): string {
  const [year, month, day] = parseCivilDate(value);
  const next = new Date(year, month - 1, day + amount, 12);
  return formatLocalDate(next);
}

export function createCalendarWindow(
  startDate: string,
  numberOfDays = 7,
): CalendarWindow {
  if (!Number.isInteger(numberOfDays) || numberOfDays < 1 || numberOfDays > 7) {
    throw new RangeError("Calendar window must contain 1 to 7 days.");
  }
  const [year, month, day] = parseCivilDate(startDate);
  const start = new Date(year, month - 1, day);
  const end = new Date(year, month - 1, day + numberOfDays);
  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
    startDate,
    endDateExclusive: addCivilDays(startDate, numberOfDays),
  };
}

export function createPlanningWindow(
  date: string,
  startHour = 7,
  endHour = 21,
): { startMs: number; endMs: number } {
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    startHour < 0 ||
    endHour > 24 ||
    startHour >= endHour
  ) {
    throw new RangeError("Planning hours must form a valid same-day interval.");
  }
  const [year, month, day] = parseCivilDate(date);
  const start = new Date(year, month - 1, day, startHour);
  const end = new Date(year, month - 1, day, endHour);
  return { startMs: start.getTime(), endMs: end.getTime() };
}

export function classificationFor(
  classifications: ClassificationMap,
  eventId: string,
): EventClassification {
  return classifications[eventId] ?? EMPTY_CLASSIFICATION;
}

export function normalizeClassification(
  value: EventClassification,
): EventClassification {
  if (value.recovery) {
    return {
      ...value,
      fixed: true,
      movable: false,
      reducible: false,
    };
  }
  if (value.fixed && value.movable) {
    return { ...value, movable: false };
  }
  return value;
}

export function occurrencesOnDate(
  occurrences: CalendarOccurrence[],
  date: string,
): CalendarOccurrence[] {
  const dayWindow = createCalendarWindow(date, 1);
  return occurrences
    .filter((occurrence) => {
      if (occurrence.kind === "all-day") {
        return occurrence.startDate < dayWindow.endDateExclusive &&
          occurrence.endDateExclusive > date;
      }
      return occurrence.endMs > dayWindow.startMs && occurrence.startMs < dayWindow.endMs;
    })
    .sort((left, right) => {
      if (left.kind !== right.kind) return left.kind === "all-day" ? -1 : 1;
      if (left.kind === "all-day" && right.kind === "all-day") {
        return left.startDate.localeCompare(right.startDate) || left.title.localeCompare(right.title);
      }
      if (left.kind === "timed" && right.kind === "timed") {
        return left.startMs - right.startMs || left.endMs - right.endMs || left.id.localeCompare(right.id);
      }
      return 0;
    });
}

type Interval = { startMs: number; endMs: number };

function clippedIntervals(
  events: TimedCalendarOccurrence[],
  window: { startMs: number; endMs: number },
): Interval[] {
  return events
    .map((event) => ({
      startMs: Math.max(event.startMs, window.startMs),
      endMs: Math.min(event.endMs, window.endMs),
    }))
    .filter((interval) => interval.endMs > interval.startMs)
    .sort((left, right) => left.startMs - right.startMs || left.endMs - right.endMs);
}

function mergeIntervals(intervals: Interval[]): Interval[] {
  const merged: Interval[] = [];
  for (const interval of intervals) {
    const previous = merged.at(-1);
    if (!previous || interval.startMs > previous.endMs) {
      merged.push({ ...interval });
    } else {
      previous.endMs = Math.max(previous.endMs, interval.endMs);
    }
  }
  return merged;
}

function minutesBetween(startMs: number, endMs: number): number {
  return Math.max(0, Math.round((endMs - startMs) / 60_000));
}

function findOpenIntervals(
  merged: Interval[],
  window: { startMs: number; endMs: number },
): OpenInterval[] {
  const open: OpenInterval[] = [];
  let cursor = window.startMs;
  for (const interval of merged) {
    if (interval.startMs > cursor) {
      open.push({
        startMs: cursor,
        endMs: interval.startMs,
        minutes: minutesBetween(cursor, interval.startMs),
      });
    }
    cursor = Math.max(cursor, interval.endMs);
  }
  if (cursor < window.endMs) {
    open.push({
      startMs: cursor,
      endMs: window.endMs,
      minutes: minutesBetween(cursor, window.endMs),
    });
  }
  return open;
}

export function computeDayMetrics(
  occurrences: CalendarOccurrence[],
  classifications: ClassificationMap,
  date: string,
): DayMetrics {
  const dayOccurrences = occurrencesOnDate(occurrences, date);
  const timed = dayOccurrences.filter(
    (event): event is TimedCalendarOccurrence => event.kind === "timed",
  );
  const window = createPlanningWindow(date);
  const intervals = clippedIntervals(timed, window);
  const merged = mergeIntervals(intervals);
  const scheduledMinutes = intervals.reduce(
    (total, interval) => total + minutesBetween(interval.startMs, interval.endMs),
    0,
  );
  const occupiedMinutes = merged.reduce(
    (total, interval) => total + minutesBetween(interval.startMs, interval.endMs),
    0,
  );
  const openIntervals = findOpenIntervals(merged, window);
  const recovery = timed.filter(
    (event) => classificationFor(classifications, event.id).recovery,
  );
  const protectedRecoveryMinutes = mergeIntervals(clippedIntervals(recovery, window)).reduce(
    (total, interval) => total + minutesBetween(interval.startMs, interval.endMs),
    0,
  );
  const labels = dayOccurrences.map((event) =>
    classificationFor(classifications, event.id),
  );
  const totalPlanningMinutes = minutesBetween(window.startMs, window.endMs);
  const highEnergyCount = labels.filter((label) => label.highEnergy).length;
  const overlapMinutes = Math.max(0, scheduledMinutes - occupiedMinutes);
  const pressurePoints =
    occupiedMinutes / totalPlanningMinutes +
    Math.min(0.35, overlapMinutes / 240) +
    Math.min(0.3, highEnergyCount * 0.06);

  return {
    eventCount: dayOccurrences.length,
    timedEventCount: timed.length,
    allDayEventCount: dayOccurrences.length - timed.length,
    scheduledMinutes,
    occupiedMinutes,
    freeMinutes: Math.max(0, totalPlanningMinutes - occupiedMinutes),
    longestOpenMinutes: Math.max(0, ...openIntervals.map((interval) => interval.minutes)),
    overlapMinutes,
    fragmentedGapCount: openIntervals.filter(
      (interval) => interval.minutes >= 15 && interval.minutes < 60,
    ).length,
    protectedRecoveryMinutes,
    fixedCount: labels.filter((label) => label.fixed).length,
    movableCount: labels.filter((label) => label.movable).length,
    reducibleCount: labels.filter((label) => label.reducible).length,
    highEnergyCount,
    recoveryCount: labels.filter((label) => label.recovery).length,
    pressure: pressurePoints >= 0.82 ? "overfull" : pressurePoints >= 0.55 ? "full" : "gentle",
    openIntervals,
  };
}

export function dayMetricsForJournal(metrics: DayMetrics) {
  return {
    eventCount: metrics.eventCount,
    occupiedMinutes: metrics.occupiedMinutes,
    freeMinutes: metrics.freeMinutes,
    overlapMinutes: metrics.overlapMinutes,
    fragmentedGapCount: metrics.fragmentedGapCount,
    protectedRecoveryMinutes: metrics.protectedRecoveryMinutes,
  };
}
