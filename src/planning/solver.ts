const MINUTE_MS = 60_000;
const MAX_CHANGES = 3;
const MAX_OPERATION_CANDIDATES = 36;
const MAX_RETURNED_PLANS = 3;

export type EventMobility = "neutral" | "fixed" | "movable";

export type PlanningEvent = {
  id: string;
  title: string;
  startMs: number;
  endMs: number;
  mobility: EventMobility;
  reducible: boolean;
  highEnergy: boolean;
  recovery: boolean;
  allDay?: boolean;
};

export type TimeInterval = {
  startMs: number;
  endMs: number;
  durationMinutes: number;
};

export type DayMetrics = {
  dayMinutes: number;
  occupiedMinutes: number;
  openMinutes: number;
  longestOpenMinutes: number;
  occupiedIntervals: TimeInterval[];
  openIntervals: TimeInterval[];
};

export type PostponeOperation = {
  kind: "postpone";
  eventId: string;
  title: string;
  originalStartMs: number;
  originalEndMs: number;
  changedMinutes: number;
  highEnergy: boolean;
};

export type ReduceOperation = {
  kind: "reduce";
  eventId: string;
  title: string;
  originalStartMs: number;
  originalEndMs: number;
  resultingEndMs: number;
  changedMinutes: number;
  highEnergy: boolean;
};

export type PlanOperation = PostponeOperation | ReduceOperation;

export type ReplacementPlan = {
  id: string;
  operations: PlanOperation[];
  changedEventCount: number;
  changedMinutes: number;
  availableSlot: TimeInterval;
  metrics: DayMetrics;
};

export type NoPlanCode =
  | "required-time-exceeds-day"
  | "candidate-limit-exceeded"
  | "no-eligible-changes"
  | "three-changes-not-enough";

export type NoPlanReason = {
  code: NoPlanCode;
  message: string;
};

export type ReplacementSolverInput = {
  dayStartMs: number;
  dayEndMs: number;
  requiredMinutes: number;
  events: readonly PlanningEvent[];
};

export type ReplacementSolverResult = {
  baseline: DayMetrics;
  requiredMinutes: number;
  fitsWithoutChanges: boolean;
  plans: ReplacementPlan[];
  noPlanReason: NoPlanReason | null;
  candidateOperationCount: number;
  searchedSubsetCount: number;
};

type InternalInterval = {
  startMs: number;
  endMs: number;
};

function durationMinutes(interval: InternalInterval): number {
  return (interval.endMs - interval.startMs) / MINUTE_MS;
}

function publicInterval(interval: InternalInterval): TimeInterval {
  return { ...interval, durationMinutes: durationMinutes(interval) };
}

function clipInterval(
  startMs: number,
  endMs: number,
  dayStartMs: number,
  dayEndMs: number,
): InternalInterval | null {
  const clipped = {
    startMs: Math.max(startMs, dayStartMs),
    endMs: Math.min(endMs, dayEndMs),
  };

  return clipped.endMs > clipped.startMs ? clipped : null;
}

function unionIntervals(intervals: readonly InternalInterval[]): InternalInterval[] {
  const sorted = [...intervals].sort(
    (a, b) => a.startMs - b.startMs || a.endMs - b.endMs,
  );
  const union: InternalInterval[] = [];

  for (const interval of sorted) {
    const previous = union.at(-1);
    if (!previous || interval.startMs > previous.endMs) {
      union.push({ ...interval });
    } else {
      previous.endMs = Math.max(previous.endMs, interval.endMs);
    }
  }

  return union;
}

function metricsFromIntervals(
  intervals: readonly InternalInterval[],
  dayStartMs: number,
  dayEndMs: number,
): DayMetrics {
  const occupied = unionIntervals(intervals);
  const open: InternalInterval[] = [];
  let cursor = dayStartMs;

  for (const interval of occupied) {
    if (interval.startMs > cursor) {
      open.push({ startMs: cursor, endMs: interval.startMs });
    }
    cursor = Math.max(cursor, interval.endMs);
  }

  if (cursor < dayEndMs) open.push({ startMs: cursor, endMs: dayEndMs });

  const occupiedMinutes = occupied.reduce(
    (sum, interval) => sum + durationMinutes(interval),
    0,
  );
  const dayMinutes = (dayEndMs - dayStartMs) / MINUTE_MS;

  return {
    dayMinutes,
    occupiedMinutes,
    openMinutes: dayMinutes - occupiedMinutes,
    longestOpenMinutes: open.reduce(
      (longest, interval) => Math.max(longest, durationMinutes(interval)),
      0,
    ),
    occupiedIntervals: occupied.map(publicInterval),
    openIntervals: open.map(publicInterval),
  };
}

function validateInput(input: ReplacementSolverInput): void {
  if (
    !Number.isFinite(input.dayStartMs) ||
    !Number.isFinite(input.dayEndMs) ||
    input.dayEndMs <= input.dayStartMs
  ) {
    throw new RangeError("Day bounds must be finite and end after they start.");
  }
  if (!Number.isFinite(input.requiredMinutes) || input.requiredMinutes <= 0) {
    throw new RangeError("Required minutes must be a positive finite number.");
  }

  const ids = new Set<string>();
  for (const event of input.events) {
    if (!event.id || ids.has(event.id)) {
      throw new TypeError("Planning event IDs must be non-empty and unique.");
    }
    ids.add(event.id);

    if (
      !Number.isFinite(event.startMs) ||
      !Number.isFinite(event.endMs) ||
      event.endMs <= event.startMs
    ) {
      throw new RangeError(`Planning event ${event.id} has invalid bounds.`);
    }
  }
}

function eventIntervals(
  events: readonly PlanningEvent[],
  operations: readonly PlanOperation[],
  dayStartMs: number,
  dayEndMs: number,
): InternalInterval[] {
  const operationsByEvent = new Map(
    operations.map((operation) => [operation.eventId, operation]),
  );

  return events.flatMap((event) => {
    if (event.allDay) return [];
    const operation = operationsByEvent.get(event.id);
    if (operation?.kind === "postpone") return [];

    const endMs =
      operation?.kind === "reduce" ? operation.resultingEndMs : event.endMs;
    const clipped = clipInterval(
      event.startMs,
      endMs,
      dayStartMs,
      dayEndMs,
    );

    return clipped ? [clipped] : [];
  });
}

function removedMinutesWithinDay(
  event: PlanningEvent,
  resultingEndMs: number,
  dayStartMs: number,
  dayEndMs: number,
): number {
  const original = clipInterval(
    event.startMs,
    event.endMs,
    dayStartMs,
    dayEndMs,
  );
  const reduced = clipInterval(
    event.startMs,
    resultingEndMs,
    dayStartMs,
    dayEndMs,
  );

  return (
    (original ? original.endMs - original.startMs : 0) -
    (reduced ? reduced.endMs - reduced.startMs : 0)
  ) / MINUTE_MS;
}

function buildOperationCandidates(
  input: ReplacementSolverInput,
): PlanOperation[] {
  const sortedEvents = [...input.events].sort(
    (a, b) =>
      a.startMs - b.startMs ||
      a.endMs - b.endMs ||
      a.id.localeCompare(b.id),
  );
  const operations: PlanOperation[] = [];

  for (const event of sortedEvents) {
    if (event.allDay || event.mobility === "fixed" || event.recovery) continue;

    const clipped = clipInterval(
      event.startMs,
      event.endMs,
      input.dayStartMs,
      input.dayEndMs,
    );
    if (!clipped) continue;

    if (event.reducible) {
      const resultingEndMs =
        event.startMs + Math.floor((event.endMs - event.startMs) / 2);
      const changedMinutes = removedMinutesWithinDay(
        event,
        resultingEndMs,
        input.dayStartMs,
        input.dayEndMs,
      );

      if (resultingEndMs > event.startMs && changedMinutes > 0) {
        operations.push({
          kind: "reduce",
          eventId: event.id,
          title: event.title,
          originalStartMs: event.startMs,
          originalEndMs: event.endMs,
          resultingEndMs,
          changedMinutes,
          highEnergy: event.highEnergy,
        });
      }
    }

    if (event.mobility === "movable") {
      operations.push({
        kind: "postpone",
        eventId: event.id,
        title: event.title,
        originalStartMs: event.startMs,
        originalEndMs: event.endMs,
        changedMinutes: durationMinutes(clipped),
        highEnergy: event.highEnergy,
      });
    }
  }

  return operations;
}

function earliestSlot(
  metrics: DayMetrics,
  requiredMinutes: number,
): TimeInterval | null {
  const interval = metrics.openIntervals.find(
    (candidate) => candidate.durationMinutes >= requiredMinutes,
  );
  if (!interval) return null;

  return {
    startMs: interval.startMs,
    endMs: interval.startMs + requiredMinutes * MINUTE_MS,
    durationMinutes: requiredMinutes,
  };
}

function operationSignature(operations: readonly PlanOperation[]): string {
  return operations
    .map((operation) => `${operation.eventId}:${operation.kind}`)
    .join("|");
}

function createPlan(
  input: ReplacementSolverInput,
  operations: readonly PlanOperation[],
): ReplacementPlan | null {
  const metrics = metricsFromIntervals(
    eventIntervals(
      input.events,
      operations,
      input.dayStartMs,
      input.dayEndMs,
    ),
    input.dayStartMs,
    input.dayEndMs,
  );
  const availableSlot = earliestSlot(metrics, input.requiredMinutes);
  if (!availableSlot) return null;

  const stableOperations = [...operations];
  return {
    id: stableOperations.length
      ? `plan:${operationSignature(stableOperations)}`
      : "plan:no-change",
    operations: stableOperations,
    changedEventCount: stableOperations.length,
    changedMinutes: stableOperations.reduce(
      (sum, operation) => sum + operation.changedMinutes,
      0,
    ),
    availableSlot,
    metrics,
  };
}

function comparePlans(a: ReplacementPlan, b: ReplacementPlan): number {
  return (
    a.changedEventCount - b.changedEventCount ||
    a.changedMinutes - b.changedMinutes ||
    a.availableSlot.startMs - b.availableSlot.startMs ||
    operationSignature(a.operations).localeCompare(operationSignature(b.operations))
  );
}

function dominates(a: ReplacementPlan, b: ReplacementPlan): boolean {
  return (
    a.changedEventCount <= b.changedEventCount &&
    a.changedMinutes <= b.changedMinutes &&
    (a.changedEventCount < b.changedEventCount ||
      a.changedMinutes < b.changedMinutes)
  );
}

function reason(code: NoPlanCode): NoPlanReason {
  const messages: Record<NoPlanCode, string> = {
    "required-time-exceeds-day":
      "This needs more uninterrupted time than the selected day contains.",
    "candidate-limit-exceeded":
      "This day has too many changeable events to search safely in one breath.",
    "no-eligible-changes":
      "There is no large enough gap, and the remaining time is fixed, protected recovery, or not marked as changeable.",
    "three-changes-not-enough":
      "No combination of three or fewer allowed changes creates enough uninterrupted time.",
  };

  return { code, message: messages[code] };
}

/**
 * Searches every compatible subset of the bounded operation set. Event titles
 * are carried only for display: eligibility is determined exclusively by the
 * user's mobility, reducible, and recovery classifications.
 */
export function solveReplacementPlans(
  input: ReplacementSolverInput,
): ReplacementSolverResult {
  validateInput(input);

  const baseline = metricsFromIntervals(
    eventIntervals(input.events, [], input.dayStartMs, input.dayEndMs),
    input.dayStartMs,
    input.dayEndMs,
  );
  const baselinePlan = createPlan(input, []);

  if (baselinePlan) {
    return {
      baseline,
      requiredMinutes: input.requiredMinutes,
      fitsWithoutChanges: true,
      plans: [baselinePlan],
      noPlanReason: null,
      candidateOperationCount: 0,
      searchedSubsetCount: 1,
    };
  }

  if (input.requiredMinutes > baseline.dayMinutes) {
    return {
      baseline,
      requiredMinutes: input.requiredMinutes,
      fitsWithoutChanges: false,
      plans: [],
      noPlanReason: reason("required-time-exceeds-day"),
      candidateOperationCount: 0,
      searchedSubsetCount: 1,
    };
  }

  const candidates = buildOperationCandidates(input);
  if (candidates.length > MAX_OPERATION_CANDIDATES) {
    return {
      baseline,
      requiredMinutes: input.requiredMinutes,
      fitsWithoutChanges: false,
      plans: [],
      noPlanReason: reason("candidate-limit-exceeded"),
      candidateOperationCount: candidates.length,
      searchedSubsetCount: 1,
    };
  }

  if (candidates.length === 0) {
    return {
      baseline,
      requiredMinutes: input.requiredMinutes,
      fitsWithoutChanges: false,
      plans: [],
      noPlanReason: reason("no-eligible-changes"),
      candidateOperationCount: 0,
      searchedSubsetCount: 1,
    };
  }

  const qualifyingPlans: ReplacementPlan[] = [];
  let searchedSubsetCount = 0;

  const search = (
    startIndex: number,
    selected: PlanOperation[],
    selectedEventIds: Set<string>,
  ) => {
    searchedSubsetCount += 1;
    const plan = createPlan(input, selected);
    if (plan) qualifyingPlans.push(plan);
    if (selected.length === MAX_CHANGES) return;

    for (let index = startIndex; index < candidates.length; index += 1) {
      const candidate = candidates[index]!;
      if (selectedEventIds.has(candidate.eventId)) continue;

      selected.push(candidate);
      selectedEventIds.add(candidate.eventId);
      search(index + 1, selected, selectedEventIds);
      selectedEventIds.delete(candidate.eventId);
      selected.pop();
    }
  };

  search(0, [], new Set<string>());

  const minimalPlans = qualifyingPlans
    .filter(
      (plan, index) =>
        !qualifyingPlans.some(
          (other, otherIndex) => otherIndex !== index && dominates(other, plan),
        ),
    )
    .sort(comparePlans)
    .slice(0, MAX_RETURNED_PLANS);

  return {
    baseline,
    requiredMinutes: input.requiredMinutes,
    fitsWithoutChanges: false,
    plans: minimalPlans,
    noPlanReason:
      minimalPlans.length > 0 ? null : reason("three-changes-not-enough"),
    candidateOperationCount: candidates.length,
    searchedSubsetCount,
  };
}
