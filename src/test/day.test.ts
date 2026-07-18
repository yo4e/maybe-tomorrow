import { describe, expect, it } from "vitest";
import {
  computeDayMetrics,
  createCalendarWindow,
  createPlanningWindow,
  normalizeClassification,
  occurrencesOnDate,
} from "../calendar/day";
import type { CalendarOccurrence } from "../calendar/types";

const date = "2026-07-21";
const planning = createPlanningWindow(date);

function event(
  id: string,
  startOffsetMinutes: number,
  durationMinutes: number,
): CalendarOccurrence {
  return {
    id,
    sourceId: "source",
    calendarName: "Demo",
    uid: id,
    title: id,
    status: "confirmed",
    kind: "timed",
    allDay: false,
    startMs: planning.startMs + startOffsetMinutes * 60_000,
    endMs: planning.startMs + (startOffsetMinutes + durationMinutes) * 60_000,
  };
}

describe("calendar day", () => {
  it("creates a seven-day local import window", () => {
    const window = createCalendarWindow(date, 7);
    expect(window.startDate).toBe(date);
    expect(window.endDateExclusive).toBe("2026-07-28");
    expect(window.endMs).toBeGreaterThan(window.startMs);
  });

  it("uses interval unions for occupancy and reports overlap separately", () => {
    const metrics = computeDayMetrics(
      [event("one", 60, 120), event("two", 120, 120)],
      {},
      date,
    );
    expect(metrics.scheduledMinutes).toBe(240);
    expect(metrics.occupiedMinutes).toBe(180);
    expect(metrics.overlapMinutes).toBe(60);
  });

  it("keeps all-day events visible without treating them as 24 hours of load", () => {
    const allDay: CalendarOccurrence = {
      id: "all-day",
      sourceId: "source",
      calendarName: "Demo",
      uid: "all-day",
      title: "All day",
      status: "confirmed",
      kind: "all-day",
      allDay: true,
      startDate: date,
      endDateExclusive: "2026-07-22",
    };
    expect(occurrencesOnDate([allDay], date)).toHaveLength(1);
    expect(computeDayMetrics([allDay], {}, date).occupiedMinutes).toBe(0);
  });

  it("protects recovery and resolves conflicting mobility labels", () => {
    expect(
      normalizeClassification({
        fixed: false,
        movable: true,
        reducible: true,
        highEnergy: false,
        recovery: true,
      }),
    ).toEqual({
      fixed: true,
      movable: false,
      reducible: false,
      highEnergy: false,
      recovery: true,
    });
  });
});
