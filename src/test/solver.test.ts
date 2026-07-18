import { describe, expect, it } from "vitest";
import {
  solveReplacementPlans,
  type PlanningEvent,
  type ReplacementSolverInput,
} from "../planning/solver";

const minute = (value: number): number => value * 60_000;

const event = (
  id: string,
  start: number,
  end: number,
  overrides: Partial<PlanningEvent> = {},
): PlanningEvent => ({
  id,
  title: `Event ${id}`,
  startMs: minute(start),
  endMs: minute(end),
  mobility: "neutral",
  reducible: false,
  highEnergy: false,
  recovery: false,
  ...overrides,
});

const input = (
  events: PlanningEvent[],
  overrides: Partial<ReplacementSolverInput> = {},
): ReplacementSolverInput => ({
  dayStartMs: minute(0),
  dayEndMs: minute(480),
  requiredMinutes: 60,
  events,
  ...overrides,
});

describe("solveReplacementPlans metrics", () => {
  it("uses interval union so overlaps are not counted twice", () => {
    const result = solveReplacementPlans(
      input([
        event("a", 0, 60),
        event("b", 30, 120),
      ]),
    );

    expect(result.baseline.occupiedMinutes).toBe(120);
    expect(result.baseline.openMinutes).toBe(360);
    expect(result.baseline.longestOpenMinutes).toBe(360);
  });

  it("returns the earliest no-change slot when the activity already fits", () => {
    const result = solveReplacementPlans(
      input([event("middle", 120, 240)], { requiredMinutes: 90 }),
    );

    expect(result.fitsWithoutChanges).toBe(true);
    expect(result.noPlanReason).toBeNull();
    expect(result.plans).toHaveLength(1);
    expect(result.plans[0]!.operations).toEqual([]);
    expect(result.plans[0]!.availableSlot).toMatchObject({
      startMs: minute(0),
      endMs: minute(90),
    });
  });
});

describe("solveReplacementPlans operations", () => {
  it("can postpone a user-marked movable event", () => {
    const result = solveReplacementPlans(
      input(
        [event("movable", 0, 120, { mobility: "movable" })],
        { dayEndMs: minute(120), requiredMinutes: 120 },
      ),
    );

    expect(result.plans).toHaveLength(1);
    expect(result.plans[0]!.operations).toMatchObject([
      { kind: "postpone", eventId: "movable", changedMinutes: 120 },
    ]);
  });

  it("reduces an event by keeping its first half", () => {
    const result = solveReplacementPlans(
      input(
        [event("reducible", 0, 120, { reducible: true })],
        { dayEndMs: minute(120), requiredMinutes: 60 },
      ),
    );

    expect(result.plans[0]!.operations).toMatchObject([
      {
        kind: "reduce",
        eventId: "reducible",
        resultingEndMs: minute(60),
        changedMinutes: 60,
      },
    ]);
    expect(result.plans[0]!.availableSlot.startMs).toBe(minute(60));
  });

  it("never changes a fixed event even when contradictory flags say it is movable and reducible", () => {
    const result = solveReplacementPlans(
      input(
        [
          event("fixed", 0, 120, {
            mobility: "fixed",
            reducible: true,
          }),
        ],
        { dayEndMs: minute(120), requiredMinutes: 60 },
      ),
    );

    expect(result.plans).toEqual([]);
    expect(result.candidateOperationCount).toBe(0);
    expect(result.noPlanReason?.code).toBe("no-eligible-changes");
  });

  it("always protects recovery time", () => {
    const result = solveReplacementPlans(
      input(
        [
          event("recovery", 0, 120, {
            mobility: "movable",
            reducible: true,
            recovery: true,
          }),
        ],
        { dayEndMs: minute(120), requiredMinutes: 60 },
      ),
    );

    expect(result.plans).toEqual([]);
    expect(result.noPlanReason?.code).toBe("no-eligible-changes");
  });

  it("requires every overlapping event to leave before claiming the gap", () => {
    const result = solveReplacementPlans(
      input(
        [
          event("a", 0, 120, { mobility: "movable" }),
          event("b", 0, 120, { mobility: "movable" }),
        ],
        { dayEndMs: minute(120), requiredMinutes: 120 },
      ),
    );

    expect(result.baseline.occupiedMinutes).toBe(120);
    expect(result.plans).toHaveLength(1);
    expect(result.plans[0]!.operations.map((operation) => operation.eventId)).toEqual([
      "a",
      "b",
    ]);
    expect(result.plans[0]!.changedEventCount).toBe(2);
  });

  it("does not combine postpone and reduce operations for the same event", () => {
    const result = solveReplacementPlans(
      input(
        [
          event("both", 0, 120, {
            mobility: "movable",
            reducible: true,
          }),
        ],
        { dayEndMs: minute(120), requiredMinutes: 60 },
      ),
    );

    expect(
      result.plans.every(
        (plan) => new Set(plan.operations.map((operation) => operation.eventId)).size === plan.operations.length,
      ),
    ).toBe(true);
    expect(result.plans[0]!.operations[0]!.kind).toBe("reduce");
  });
});

describe("solveReplacementPlans bounds and ordering", () => {
  it("stops at three event changes with a clear no-plan reason", () => {
    const result = solveReplacementPlans(
      input(
        [
          event("a", 0, 30, { mobility: "movable" }),
          event("b", 30, 60, { mobility: "movable" }),
          event("c", 60, 90, { mobility: "movable" }),
          event("d", 90, 120, { mobility: "movable" }),
        ],
        { dayEndMs: minute(120), requiredMinutes: 120 },
      ),
    );

    expect(result.plans).toEqual([]);
    expect(result.noPlanReason?.code).toBe("three-changes-not-enough");
  });

  it("ranks equally small plans chronologically and returns at most three", () => {
    const result = solveReplacementPlans(
      input(
        [
          event("early", 0, 60, { mobility: "movable" }),
          event("middle", 60, 120),
          event("late", 120, 180, { mobility: "movable" }),
        ],
        { dayEndMs: minute(180), requiredMinutes: 60 },
      ),
    );

    expect(result.plans.length).toBeLessThanOrEqual(3);
    expect(result.plans.map((plan) => plan.operations[0]!.eventId)).toEqual([
      "early",
      "late",
    ]);
    expect(solveReplacementPlans(input(
      [
        event("early", 0, 60, { mobility: "movable" }),
        event("middle", 60, 120),
        event("late", 120, 180, { mobility: "movable" }),
      ],
      { dayEndMs: minute(180), requiredMinutes: 60 },
    ))).toEqual(result);
  });

  it("reports when the requested block is longer than the day", () => {
    const result = solveReplacementPlans(
      input([], { dayEndMs: minute(60), requiredMinutes: 61 }),
    );

    expect(result.plans).toEqual([]);
    expect(result.noPlanReason?.code).toBe("required-time-exceeds-day");
  });
});
