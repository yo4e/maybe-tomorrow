import { act, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ClassificationMap } from "../calendar/day";
import {
  DEMO_CALENDAR_DATE,
  DEMO_CLASSIFICATIONS_BY_UID,
  importDemoCalendar,
} from "../calendar/demo";
import { createLocalCalendarWindow } from "../calendar/importCore";
import { CalendarImportPanel } from "../components/CalendarImportPanel";
import {
  CalendarTriage,
  CandidateSetup,
  TodayMap,
  type PlannerSnapshot,
} from "../components/CalendarPlanner";
import { DecisionJournal } from "../components/DecisionJournal";
import { Home } from "../components/Home";
import { createDecision } from "../domain/scoring";
import type { JournalEntry } from "../storage/journal";

type MountedRoot = {
  container: HTMLDivElement;
  root: Root;
};

const mountedRoots: MountedRoot[] = [];
let animationFrames: FrameRequestCallback[] = [];

function mount(node: ReactNode): MountedRoot {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(node));
  const mounted = { container, root };
  mountedRoots.push(mounted);
  return mounted;
}

function flushAnimationFrames(): void {
  const pending = animationFrames;
  animationFrames = [];
  act(() => {
    pending.forEach((callback) => callback(0));
  });
}

function demoPlannerState(): {
  classifications: ClassificationMap;
  snapshot: PlannerSnapshot;
} {
  const window = createLocalCalendarWindow(DEMO_CALENDAR_DATE, 7);
  const result = importDemoCalendar(window);
  const classifications: ClassificationMap = {};
  for (const occurrence of result.occurrences) {
    const classification = DEMO_CLASSIFICATIONS_BY_UID[occurrence.uid];
    if (classification) classifications[occurrence.id] = { ...classification };
  }
  return {
    classifications,
    snapshot: {
      id: "accessibility-sample",
      name: "Yoshie’s fictional Tuesday",
      source: "demo",
      importedAt: "2026-07-19T00:00:00.000Z",
      window,
      occurrences: result.occurrences,
      warnings: result.warnings,
    },
  };
}

function journalEntry(id: string, activity: string): JournalEntry {
  const decision = createDecision(activity, {
    urgency: 0,
    commitment: 0,
    desire: 4,
    energyCost: 4,
    dayLoad: 4,
    recoveryNeed: 3,
    tomorrowFlexibility: 4,
    shrinkable: true,
  });
  return {
    version: 2,
    kind: "quick-check",
    id,
    savedAt: "2026-07-19T00:00:00.000Z",
    decision: { ...decision, id, activity },
  };
}

function JournalHarness({ initialEntries }: { initialEntries: JournalEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  return (
    <DecisionJournal
      entries={entries}
      onDelete={(id) => setEntries((current) => current.filter((entry) => entry.id !== id))}
      onClear={() => setEntries([])}
    />
  );
}

beforeEach(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  animationFrames = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    animationFrames.push(callback);
    return animationFrames.length;
  });
});

afterEach(() => {
  while (mountedRoots.length > 0) {
    const mounted = mountedRoots.pop();
    if (!mounted) continue;
    act(() => mounted.root.unmount());
    mounted.container.remove();
  }
  vi.restoreAllMocks();
});

describe("Issue #7 accessibility semantics", () => {
  it("names the optional Home actions as a group", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <Home onImport={() => undefined} onQuickCheck={() => undefined} onTryDemo={() => undefined} />,
    );
    const group = container.querySelector('[role="group"][aria-label="Optional ways to add context"]');

    expect(group).not.toBeNull();
    expect(group?.querySelectorAll("button")).toHaveLength(2);
  });

  it("associates a candidate activity validation error with its input", () => {
    const { container } = mount(
      <CandidateSetup onBack={() => undefined} onContinue={() => undefined} />,
    );
    const form = container.querySelector("form");
    const input = container.querySelector<HTMLInputElement>("#candidate-activity");

    expect(form).not.toBeNull();
    act(() => {
      form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    const error = container.querySelector("#candidate-activity-error");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(input?.getAttribute("aria-describedby")).toBe("candidate-activity-error");
    expect(error?.getAttribute("role")).toBe("alert");
  });

  it("ties calendar-file errors to the file input", () => {
    const { container } = mount(
      <CalendarImportPanel
        busy={false}
        error="This calendar file could not be read."
        onBack={() => undefined}
        onImport={async () => undefined}
        onLoadDemo={() => undefined}
      />,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const describedIds = input?.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(input?.getAttribute("aria-invalid")).toBe("true");
    expect(describedIds).toHaveLength(2);
    expect(describedIds.every((id) => document.getElementById(id))).toBe(true);
  });

  it("announces a selected calendar-file count once through a dedicated live status", () => {
    const { container } = mount(
      <CalendarImportPanel
        busy={false}
        error={null}
        onBack={() => undefined}
        onImport={async () => undefined}
        onLoadDemo={() => undefined}
      />,
    );
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(["BEGIN:VCALENDAR\nEND:VCALENDAR"], "sample.ics", {
      type: "text/calendar",
    });

    expect(input).not.toBeNull();
    Object.defineProperty(input, "files", { configurable: true, value: [file] });
    act(() => input?.dispatchEvent(new Event("change", { bubbles: true })));

    const status = container.querySelector("[data-file-selection-status]");
    const list = container.querySelector(".selected-files");
    expect(status?.textContent?.trim()).toBe("1 calendar file selected.");
    expect(status?.getAttribute("aria-live")).toBe("polite");
    expect(status?.getAttribute("aria-atomic")).toBe("true");
    expect(list?.hasAttribute("aria-live")).toBe(false);
  });

  it("includes the selected date in triage status and exposes a concise Today Map update", () => {
    const { classifications, snapshot } = demoPlannerState();
    const triageContainer = document.createElement("div");
    triageContainer.innerHTML = renderToStaticMarkup(
      <CalendarTriage
        classifications={classifications}
        onBack={() => undefined}
        onClassify={() => undefined}
        onContinue={() => undefined}
        onDateChange={() => undefined}
        selectedDate={DEMO_CALENDAR_DATE}
        snapshot={snapshot}
      />,
    );
    const mapContainer = document.createElement("div");
    mapContainer.innerHTML = renderToStaticMarkup(
      <TodayMap
        classifications={classifications}
        onAddActivity={() => undefined}
        onChangeSnapshot={() => undefined}
        onDateChange={() => undefined}
        onEditLabels={() => undefined}
        selectedDate={DEMO_CALENDAR_DATE}
        snapshot={snapshot}
      />,
    );

    const triageStatus = triageContainer.querySelector(".triage-progress");
    const mapStatus = mapContainer.querySelector("[data-map-update-status]");
    expect(triageStatus?.textContent).toContain("Tuesday, July 21, 2026");
    expect(triageStatus?.getAttribute("aria-live")).toBe("polite");
    expect(triageStatus?.getAttribute("aria-atomic")).toBe("true");
    expect(mapStatus?.textContent).toContain("Showing Tuesday, July 21, 2026.");
    expect(mapStatus?.textContent).toContain("Longest opening 30 min.");
    expect(mapStatus?.getAttribute("aria-live")).toBe("polite");
    expect(mapStatus?.getAttribute("aria-atomic")).toBe("true");
  });

  it("moves focus to the next saved decision after deleting one", () => {
    const entries = [journalEntry("first", "First decision"), journalEntry("second", "Second decision")];
    const { container } = mount(<JournalHarness initialEntries={entries} />);
    const firstDelete = container.querySelector<HTMLButtonElement>(
      '[aria-label="Delete saved decision for First decision"]',
    );

    act(() => firstDelete?.click());
    flushAnimationFrames();

    const secondDelete = container.querySelector<HTMLButtonElement>(
      '[aria-label="Delete saved decision for Second decision"]',
    );
    expect(document.activeElement).toBe(secondDelete);
  });

  it("moves focus to the empty journal after confirmed clear", () => {
    const { container } = mount(
      <JournalHarness initialEntries={[journalEntry("only", "Only decision")]} />,
    );
    const clearTrigger = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "Clear journal",
    );

    act(() => clearTrigger?.click());
    const confirm = container.querySelector<HTMLButtonElement>(".button-danger");
    act(() => confirm?.click());
    flushAnimationFrames();

    const empty = container.querySelector<HTMLElement>(".journal-empty");
    expect(empty?.tabIndex).toBe(-1);
    expect(document.activeElement).toBe(empty);
    expect(container.querySelector<HTMLElement>("#journal")?.tabIndex).toBe(-1);
  });
});
