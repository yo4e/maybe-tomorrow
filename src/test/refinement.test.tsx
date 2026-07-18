import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createLocalCalendarWindow } from "../calendar/importCore";
import {
  DEMO_CALENDAR_DATE,
  DEMO_CLASSIFICATIONS_BY_UID,
  importDemoCalendar,
} from "../calendar/demo";
import type { ClassificationMap } from "../calendar/day";
import { CalendarImportPanel } from "../components/CalendarImportPanel";
import {
  CandidateSetup,
  TodayMap,
  type PlannerSnapshot,
} from "../components/CalendarPlanner";
import { DecisionResult } from "../components/DecisionResult";
import { Home } from "../components/Home";
import { createDecision } from "../domain/scoring";

function visibleText(markup: string): string {
  const container = document.createElement("div");
  container.innerHTML = markup;
  return container.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

describe("Issue #5 product hierarchy", () => {
  it("puts Quick Check before the optional calendar and sample paths", () => {
    const text = visibleText(
      renderToStaticMarkup(
        <Home onImport={() => undefined} onQuickCheck={() => undefined} onTryDemo={() => undefined} />,
      ),
    );

    const quickCheck = text.indexOf("Check one thing");
    const calendar = text.indexOf("Add calendar context");
    const sample = text.indexOf("Try the sample day");

    expect(text).toContain("What are you considering doing today?");
    expect(quickCheck).toBeGreaterThan(-1);
    expect(quickCheck).toBeLessThan(calendar);
    expect(calendar).toBeLessThan(sample);
    expect(text).toContain("No calendar required.");
  });

  it("carries a hero activity into the optional calendar decision", () => {
    const markup = renderToStaticMarkup(
      <CandidateSetup
        initialActivity="Start another side project"
        onBack={() => undefined}
        onContinue={() => undefined}
      />,
    );

    expect(markup).toContain('value="Start another side project"');
  });

  it("explains calendar import without making the sample primary", () => {
    const text = visibleText(
      renderToStaticMarkup(
        <CalendarImportPanel
          busy={false}
          error={null}
          onBack={() => undefined}
          onImport={async () => undefined}
          onLoadDemo={() => undefined}
        />,
      ),
    );

    expect(text).toContain("How to export from Google Calendar");
    expect(text).toContain("Import & export");
    expect(text).toContain("Do not unpack it first.");
    expect(text).toContain("not uploaded, synchronized, or written back");
    expect(text).toContain("Start date");
    expect(text).toContain("up to 10 files · 5 MB total");
    expect(text).toContain("already labeled");
    expect(text.indexOf("Use my calendar file")).toBeLessThan(
      text.indexOf("Try the sample day"),
    );
  });

  it("uses factual day language instead of an automatic load grade", () => {
    const window = createLocalCalendarWindow(DEMO_CALENDAR_DATE, 7);
    const result = importDemoCalendar(window);
    const classifications: ClassificationMap = {};
    for (const occurrence of result.occurrences) {
      const classification = DEMO_CLASSIFICATIONS_BY_UID[occurrence.uid];
      if (classification) classifications[occurrence.id] = { ...classification };
    }
    const snapshot: PlannerSnapshot = {
      id: "sample",
      name: "Yoshie’s fictional Tuesday",
      source: "demo",
      importedAt: "2026-07-18T00:00:00.000Z",
      window,
      occurrences: result.occurrences,
      warnings: result.warnings,
    };
    const text = visibleText(
      renderToStaticMarkup(
        <TodayMap
          classifications={classifications}
          onAddActivity={() => undefined}
          onChangeSnapshot={() => undefined}
          onDateChange={() => undefined}
          onEditLabels={() => undefined}
          selectedDate={DEMO_CALENDAR_DATE}
          snapshot={snapshot}
        />,
      ),
    );

    expect(text).toContain("Occupied time");
    expect(text).toContain("Longest opening");
    expect(text).not.toMatch(/\b(gentle|full|overfull)\b/i);
  });

  it("keeps technical counterfactual language out of the result controls", () => {
    const decision = createDecision("Start another side project", {
      urgency: 0,
      commitment: 0,
      desire: 4,
      energyCost: 4,
      dayLoad: 4,
      recoveryNeed: 3,
      tomorrowFlexibility: 4,
      shrinkable: true,
    });
    const text = visibleText(
      renderToStaticMarkup(
        <DecisionResult
          decision={decision}
          onSave={() => undefined}
          onTryAnother={() => undefined}
          saved={false}
        />,
      ),
    );

    expect(text).toContain("What would need to change?");
    expect(text).toContain("Show possible changes");
    expect(text).not.toContain("Counterfactual");
    expect(text).not.toContain("Replacement Solver");
  });
});
