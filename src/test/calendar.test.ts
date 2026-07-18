import { strToU8, zipSync } from "fflate";
import { describe, expect, it } from "vitest";

import { importDemoCalendar } from "../calendar/demo";
import {
  importCalendarBytes,
  importIcsText,
} from "../calendar/importCore";
import type { CalendarWindow } from "../calendar/types";

function windowFrom(
  start: string,
  end: string,
  startDate: string,
  endDateExclusive: string,
): CalendarWindow {
  return {
    startMs: Date.parse(start),
    endMs: Date.parse(end),
    startDate,
    endDateExclusive,
  };
}

const julyWindow = windowFrom(
  "2026-07-18T00:00:00Z",
  "2026-07-25T00:00:00Z",
  "2026-07-18",
  "2026-07-25",
);

function calendar(...components: string[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Maybe Tomorrow Tests//EN",
    "X-WR-CALNAME:Test calendar",
    ...components,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function event(lines: string[]): string {
  return ["BEGIN:VEVENT", ...lines, "END:VEVENT"].join("\r\n");
}

describe("calendar snapshot import", () => {
  it("parses folded hostile text, UTC events, and all-day date ranges", () => {
    const text = `\uFEFF${calendar(
      event([
        "UID:timed@test",
        "DTSTART:20260719T090000Z",
        "DTEND:20260719T100000Z",
        "SUMMARY:<img src=x onerror=alert(1)> folded ",
        " across a line",
      ]),
      event(["UID:all-day@test", "DTSTART;VALUE=DATE:20260720", "SUMMARY:Day off"]),
    )}`;

    const result = importIcsText({ text, fileName: "test.ics" }, { window: julyWindow });

    expect(result.ok).toBe(true);
    expect(result.occurrences).toHaveLength(2);
    expect(result.occurrences.map((item) => item.title)).toContain(
      "<img src=x onerror=alert(1)> folded across a line",
    );
    expect(result.occurrences.find((item) => item.uid === "all-day@test")).toMatchObject({
      kind: "all-day",
      startDate: "2026-07-20",
      endDateExclusive: "2026-07-21",
    });
  });

  it("keeps recurring wall time across a named-zone daylight-saving change", () => {
    const newYorkWindow = windowFrom(
      "2026-03-07T00:00:00-05:00",
      "2026-03-11T00:00:00-04:00",
      "2026-03-07",
      "2026-03-11",
    );
    const text = calendar(
      [
        "BEGIN:VTIMEZONE",
        "TZID:America/New_York",
        "BEGIN:DAYLIGHT",
        "DTSTART:19700308T020000",
        "TZOFFSETFROM:-0500",
        "TZOFFSETTO:-0400",
        "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
        "END:DAYLIGHT",
        "BEGIN:STANDARD",
        "DTSTART:19701101T020000",
        "TZOFFSETFROM:-0400",
        "TZOFFSETTO:-0500",
        "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
        "END:STANDARD",
        "END:VTIMEZONE",
      ].join("\r\n"),
      event([
        "UID:dst@test",
        "DTSTART;TZID=America/New_York:20260307T090000",
        "DTEND;TZID=America/New_York:20260307T100000",
        "RRULE:FREQ=DAILY;COUNT=3",
        "SUMMARY:Daily local meeting",
      ]),
    );

    const result = importIcsText({ text, fileName: "dst.ics" }, { window: newYorkWindow });
    const starts = result.occurrences
      .filter((item) => item.kind === "timed")
      .map((item) => new Date(item.startMs).toISOString());

    expect(result.warnings).toEqual([]);
    expect(starts).toEqual([
      "2026-03-07T14:00:00.000Z",
      "2026-03-08T13:00:00.000Z",
      "2026-03-09T13:00:00.000Z",
    ]);
  });

  it("respects EXDATE, moved exceptions, and cancelled instances", () => {
    const text = calendar(
      event([
        "UID:series@test",
        "DTSTART:20260718T090000Z",
        "DTEND:20260718T100000Z",
        "RRULE:FREQ=DAILY;COUNT=4",
        "EXDATE:20260720T090000Z",
        "SUMMARY:Daily series",
      ]),
      event([
        "UID:series@test",
        "RECURRENCE-ID:20260719T090000Z",
        "DTSTART:20260719T150000Z",
        "DTEND:20260719T160000Z",
        "SUMMARY:Moved series",
      ]),
      event([
        "UID:series@test",
        "RECURRENCE-ID:20260721T090000Z",
        "DTSTART:20260721T090000Z",
        "DTEND:20260721T100000Z",
        "STATUS:CANCELLED",
        "SUMMARY:Cancelled series",
      ]),
    );

    const result = importIcsText({ text, fileName: "series.ics" }, { window: julyWindow });
    const starts = result.occurrences
      .filter((item) => item.kind === "timed")
      .map((item) => new Date(item.startMs).toISOString());

    expect(starts).toEqual(["2026-07-18T09:00:00.000Z", "2026-07-19T15:00:00.000Z"]);
    expect(result.occurrences.some((item) => item.title === "Cancelled series")).toBe(false);
  });

  it("loads separate calendars from a Google-style ZIP without merging equal UIDs", () => {
    const first = calendar(
      event([
        "UID:shared@test",
        "DTSTART:20260719T090000Z",
        "DTEND:20260719T100000Z",
        "SUMMARY:First calendar",
      ]),
    );
    const second = calendar(
      event([
        "UID:shared@test",
        "DTSTART:20260719T110000Z",
        "DTEND:20260719T120000Z",
        "SUMMARY:Second calendar",
      ]),
    );
    const bytes = zipSync({
      "Takeout/Calendar/first.ics": strToU8(first),
      "Takeout/Calendar/second.ics": strToU8(second),
      "Takeout/readme.txt": strToU8("not a calendar"),
    });

    const result = importCalendarBytes(
      { bytes, fileName: "google-calendar.zip" },
      { window: julyWindow },
    );

    expect(result.ok).toBe(true);
    expect(result.sources).toHaveLength(2);
    expect(result.occurrences).toHaveLength(2);
    expect(new Set(result.occurrences.map((item) => item.id)).size).toBe(2);
  });

  it("does not silently reinterpret an unknown named timezone", () => {
    const text = calendar(
      event([
        "UID:unknown-zone@test",
        "DTSTART;TZID=Mars/Olympus:20260719T090000",
        "DTEND;TZID=Mars/Olympus:20260719T100000",
        "SUMMARY:Unknown zone",
      ]),
    );

    const result = importIcsText({ text, fileName: "unknown.ics" }, { window: julyWindow });

    expect(result.occurrences).toEqual([]);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({ code: "unsupported-timezone", eventUid: "unknown-zone@test" }),
    );
  });

  it("rejects sub-daily recurrence bombs before iteration", () => {
    const text = calendar(
      event([
        "UID:bomb@test",
        "DTSTART:20260718T000000Z",
        "DTEND:20260718T000001Z",
        "RRULE:FREQ=SECONDLY",
        "SUMMARY:No thank you",
      ]),
    );

    const result = importIcsText({ text, fileName: "bomb.ics" }, { window: julyWindow });

    expect(result.occurrences).toEqual([]);
    expect(result.stats.recurrenceIterations).toBe(0);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({ code: "unsupported-recurrence" }),
    );
  });

  it("loads the fictional overfull-day demo with stable source and classifications", () => {
    const demoWindow = windowFrom(
      "2026-07-20T15:00:00Z",
      "2026-07-21T15:00:00Z",
      "2026-07-21",
      "2026-07-22",
    );
    const first = importDemoCalendar(demoWindow);
    const second = importDemoCalendar(demoWindow);

    expect(first.ok).toBe(true);
    expect(first.sources[0]?.id).toBe("demo-overfull-tuesday");
    expect(first.occurrences).toHaveLength(10);
    expect(first.occurrences.map((item) => item.id)).toEqual(
      second.occurrences.map((item) => item.id),
    );
  });

  it("returns recoverable errors for malformed data and invalid windows", () => {
    const malformed = importIcsText(
      { text: "not a calendar", fileName: "bad.ics" },
      { window: julyWindow },
    );
    const invalidWindow = importIcsText(
      { text: calendar(), fileName: "empty.ics" },
      {
        window: {
          ...julyWindow,
          endDateExclusive: "2026-08-01",
        },
      },
    );

    expect(malformed.ok).toBe(false);
    expect(malformed.warnings[0]?.code).toBe("malformed-ics");
    expect(invalidWindow.ok).toBe(false);
    expect(invalidWindow.warnings[0]?.code).toBe("invalid-window");
  });
});
