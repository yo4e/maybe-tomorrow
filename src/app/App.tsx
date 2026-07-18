import { useEffect, useMemo, useState } from "react";
import {
  CalendarTriage,
  CandidateSetup,
  TodayMap,
  type PlannerSnapshot,
} from "../components/CalendarPlanner";
import { CalendarImportPanel } from "../components/CalendarImportPanel";
import { DecisionJournal } from "../components/DecisionJournal";
import { DecisionResult } from "../components/DecisionResult";
import { Home } from "../components/Home";
import { QuickCheckFlow } from "../components/QuickCheckFlow";
import {
  classificationFor,
  computeDayMetrics,
  createPlanningWindow,
  dayMetricsForJournal,
  type ClassificationMap,
} from "../calendar/day";
import {
  DEMO_CALENDAR_DATE,
  DEMO_CLASSIFICATIONS_BY_UID,
  importDemoCalendar,
} from "../calendar/demo";
import {
  createLocalCalendarWindow,
  importCalendarFiles,
} from "../calendar/importCore";
import type {
  CalendarImportResult,
  CalendarOccurrence,
} from "../calendar/types";
import type { Decision } from "../domain/types";
import {
  solveReplacementPlans,
  type PlanOperation,
  type ReplacementPlan,
  type ReplacementSolverResult,
} from "../planning/solver";
import {
  addJournalEntry,
  clearJournal,
  deleteJournalEntry,
  loadJournal,
  type JournalDayContext,
  type JournalEntry,
  type StorageWarning,
} from "../storage/journal";

type AppView =
  | "home"
  | "import"
  | "triage"
  | "map"
  | "candidate"
  | "planner-check"
  | "planner-result"
  | "quick-check"
  | "quick-result";

type Candidate = {
  activity: string;
  minutes: number;
};

const warningCopy: Record<StorageWarning, string> = {
  unavailable: "This browser cannot save the journal right now. The decision still counts.",
  malformed: "Some saved decisions could not be read and were safely ignored.",
};

function createLocalId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function scrollToTop(): void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

function snapshotFromResult(
  result: CalendarImportResult,
  source: PlannerSnapshot["source"],
  window: PlannerSnapshot["window"],
): PlannerSnapshot {
  const names = [...new Set(result.sources.map((item) => item.calendarName))];
  return {
    id: createLocalId("snapshot"),
    name:
      source === "demo"
        ? "Yoshie’s fictional Tuesday"
        : names.slice(0, 2).join(" + ") || "Imported calendar",
    source,
    importedAt: new Date().toISOString(),
    window,
    occurrences: result.occurrences,
    warnings: result.warnings,
  };
}

function formatMinutes(minutes: number): string {
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

function journalOperation(operation: PlanOperation): string {
  if (operation.kind === "postpone") {
    return `Postpone “${operation.title}” and release ${formatMinutes(operation.changedMinutes)}.`;
  }
  return `Keep the first half of “${operation.title}” and release ${formatMinutes(operation.changedMinutes)}.`;
}

function planningEvents(
  occurrences: CalendarOccurrence[],
  classifications: ClassificationMap,
) {
  return occurrences.flatMap((event) => {
    if (event.kind !== "timed") return [];
    const classification = classificationFor(classifications, event.id);
    return [
      {
        id: event.id,
        title: event.title,
        startMs: event.startMs,
        endMs: event.endMs,
        mobility: classification.fixed
          ? ("fixed" as const)
          : classification.movable
            ? ("movable" as const)
            : ("neutral" as const),
        reducible: classification.reducible,
        highEnergy: classification.highEnergy,
        recovery: classification.recovery,
      },
    ];
  });
}

function Header({
  hasSnapshot,
  onHome,
  onMap,
  onQuickCheck,
}: {
  hasSnapshot: boolean;
  onHome: () => void;
  onMap: () => void;
  onQuickCheck: () => void;
}) {
  return (
    <header className="site-header">
      <button className="wordmark" type="button" onClick={onHome}>
        Maybe Tomorrow.
      </button>
      <span className="header-tagline">An anti-productivity decision app</span>
      <nav aria-label="Primary navigation">
        {hasSnapshot ? (
          <button className="quiet-button" type="button" onClick={onMap}>
            Today Map
          </button>
        ) : null}
        <button className="quiet-button" type="button" onClick={onQuickCheck}>
          Quick Check
        </button>
        <a className="quiet-link" href="#journal">Journal</a>
      </nav>
    </header>
  );
}

function Principles() {
  return (
    <section className="principles-section section-block" aria-labelledby="principles-heading">
      <div>
        <div className="eyebrow">HOW THE APP DECIDES</div>
        <h2 id="principles-heading">No AI is judging your life.</h2>
      </div>
      <div className="principle-grid">
        <article>
          <span>01</span>
          <h3>Facts stay facts</h3>
          <p>Times and durations come from the file. Event meaning comes only from you.</p>
        </article>
        <article>
          <span>02</span>
          <h3>The rules are visible</h3>
          <p>Every result and room-making option follows the same fixed, tested rules.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Permission, not authority</h3>
          <p>The app previews trade-offs. It never edits a calendar or tells you what you must cancel.</p>
        </article>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-product">Built for people whose problem is not a lack of motivation.</p>
      <p>
        Maybe Tomorrow. is not medical advice. If you are unwell or in immediate
        danger, contact an appropriate medical or emergency service.
      </p>
      <p className="footer-authorship">
        Concept: Yoshie Yamada + Templex Tsukino.<br />Implementation: Codex.
      </p>
    </footer>
  );
}

export function App() {
  const [view, setView] = useState<AppView>("home");
  const [flowKey, setFlowKey] = useState(0);
  const [quickStartActivity, setQuickStartActivity] = useState("");
  const [snapshot, setSnapshot] = useState<PlannerSnapshot | null>(null);
  const [selectedDate, setSelectedDate] = useState(DEMO_CALENDAR_DATE);
  const [classifications, setClassifications] = useState<ClassificationMap>({});
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [solver, setSolver] = useState<ReplacementSolverResult | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [initialJournal] = useState(() => loadJournal());
  const [journal, setJournal] = useState<JournalEntry[]>(initialJournal.value);
  const [storageMessage, setStorageMessage] = useState<string | null>(
    initialJournal.warning ? warningCopy[initialJournal.warning] : null,
  );

  const dayMetrics = useMemo(
    () =>
      snapshot
        ? computeDayMetrics(snapshot.occurrences, classifications, selectedDate)
        : null,
    [snapshot, classifications, selectedDate],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[data-stage-focus]")?.focus();
    });
    scrollToTop();
    return () => window.cancelAnimationFrame(frame);
  }, [view]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleStorageWarning = (warning?: StorageWarning) => {
    setStorageMessage(warning ? warningCopy[warning] : null);
  };

  const resetDecision = (activity = "") => {
    setQuickStartActivity(activity);
    setCandidate(null);
    setDecision(null);
    setSolver(null);
    setSelectedPlanId(null);
    setSaved(false);
    setFlowKey((key) => key + 1);
  };

  const openHome = () => {
    setView("home");
  };

  const openQuickCheck = (activity = "") => {
    resetDecision(activity);
    setView("quick-check");
  };

  const loadDemo = (activity = "") => {
    const window = createLocalCalendarWindow(DEMO_CALENDAR_DATE, 7);
    const result = importDemoCalendar(window);
    const nextSnapshot = snapshotFromResult(result, "demo", window);
    const nextClassifications: ClassificationMap = {};
    for (const occurrence of result.occurrences) {
      const classification = DEMO_CLASSIFICATIONS_BY_UID[occurrence.uid];
      if (classification) nextClassifications[occurrence.id] = { ...classification };
    }
    setSnapshot(nextSnapshot);
    setClassifications(nextClassifications);
    setSelectedDate(DEMO_CALENDAR_DATE);
    resetDecision(activity);
    setImportError(null);
    setView("triage");
  };

  const importFiles = async (files: File[], startDate: string) => {
    setImportBusy(true);
    setImportError(null);
    try {
      const window = createLocalCalendarWindow(startDate, 7);
      const inputs = await Promise.all(
        files.map(async (file) => ({
          fileName: file.name,
          bytes: new Uint8Array(await file.arrayBuffer()),
        })),
      );
      const result = importCalendarFiles(inputs, { window });
      if (!result.ok) {
        const message = result.warnings.find((warning) => warning.severity === "error")?.message;
        setImportError(message ?? "This calendar file could not be read.");
        return;
      }
      setSnapshot(snapshotFromResult(result, "import", window));
      setClassifications({});
      setSelectedDate(startDate);
      resetDecision(quickStartActivity);
      setView("triage");
    } catch (error) {
      setImportError(
        error instanceof Error ? error.message : "This calendar file could not be read.",
      );
    } finally {
      setImportBusy(false);
    }
  };

  const completePlannerDecision = (nextDecision: Decision) => {
    if (!snapshot || !candidate) return;
    const window = createPlanningWindow(selectedDate);
    const nextSolver = solveReplacementPlans({
      dayStartMs: window.startMs,
      dayEndMs: window.endMs,
      requiredMinutes: candidate.minutes,
      events: planningEvents(snapshot.occurrences, classifications),
    });
    setDecision(nextDecision);
    setSolver(nextSolver);
    setSelectedPlanId(null);
    setSaved(false);
    setView("planner-result");
  };

  const selectedPlan: ReplacementPlan | undefined =
    solver?.plans.find((plan) => plan.id === selectedPlanId);

  const saveCurrentDecision = () => {
    if (!decision) return;
    const now = new Date().toISOString();
    let entry: JournalEntry;

    if (view === "planner-result" && snapshot && candidate && dayMetrics) {
      const contextBase: JournalDayContext = {
        snapshotId: snapshot.id,
        snapshotName: snapshot.name,
        selectedDate,
        metrics: dayMetricsForJournal(dayMetrics),
        candidateMinutes: candidate.minutes,
      };
      const dayContext: JournalDayContext = selectedPlan
        ? {
            ...contextBase,
            selectedPlan: {
              summary: `Change ${selectedPlan.changedEventCount} ${selectedPlan.changedEventCount === 1 ? "event" : "events"} to open ${formatMinutes(candidate.minutes)}.`,
              operations: selectedPlan.operations.map(journalOperation),
            },
          }
        : contextBase;
      entry = {
        version: 2,
        kind: "day-plan",
        id: decision.id,
        savedAt: now,
        decision,
        dayContext,
      };
    } else {
      entry = {
        version: 2,
        kind: "quick-check",
        id: decision.id,
        savedAt: now,
        decision,
      };
    }

    const result = addJournalEntry(entry);
    setJournal(result.value);
    handleStorageWarning(result.warning);
    if (result.ok) {
      setSaved(true);
      setToast("Saved only in this browser. Nothing was uploaded.");
    }
  };

  const changeSelectedDate = (date: string) => {
    setSelectedDate(date);
    resetDecision(quickStartActivity);
  };

  const showMap = () => {
    if (snapshot) setView("map");
  };

  return (
    <div id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="page-shell">
        <Header
          hasSnapshot={Boolean(snapshot)}
          onHome={openHome}
          onMap={showMap}
          onQuickCheck={() => openQuickCheck()}
        />
        {storageMessage ? (
          <div className="storage-warning" role="status">{storageMessage}</div>
        ) : null}

        <main id="main-content">
          {view === "home" ? (
            <Home
              initialActivity={quickStartActivity}
              onTryDemo={(activity) => loadDemo(activity)}
              onImport={(activity) => {
                setQuickStartActivity(activity);
                setImportError(null);
                setView("import");
              }}
              onQuickCheck={openQuickCheck}
            />
          ) : null}

          {view === "import" ? (
            <CalendarImportPanel
              busy={importBusy}
              error={importError}
              onBack={openHome}
              onLoadDemo={() => loadDemo(quickStartActivity)}
              onImport={importFiles}
            />
          ) : null}

          {view === "triage" && snapshot ? (
            <CalendarTriage
              snapshot={snapshot}
              selectedDate={selectedDate}
              classifications={classifications}
              onDateChange={changeSelectedDate}
              onClassify={(eventId, classification) => {
                setClassifications((current) => ({ ...current, [eventId]: classification }));
                setSaved(false);
              }}
              onBack={() => setView("import")}
              onContinue={() => setView("map")}
            />
          ) : null}

          {view === "map" && snapshot ? (
            <TodayMap
              snapshot={snapshot}
              selectedDate={selectedDate}
              classifications={classifications}
              onDateChange={changeSelectedDate}
              onEditLabels={() => setView("triage")}
              onAddActivity={() => {
                resetDecision(quickStartActivity);
                setView("candidate");
              }}
              onChangeSnapshot={() => setView("import")}
            />
          ) : null}

          {view === "candidate" && snapshot ? (
            <CandidateSetup
              initialActivity={quickStartActivity}
              onBack={() => setView("map")}
              onContinue={(activity, minutes) => {
                setQuickStartActivity(activity);
                setCandidate({ activity, minutes });
                setFlowKey((key) => key + 1);
                setView("planner-check");
              }}
            />
          ) : null}

          {view === "planner-check" && candidate ? (
            <QuickCheckFlow
              key={`planner-${flowKey}`}
              initialActivity={candidate.activity}
              contextLabel={`${candidate.minutes} MINUTES · WITH CALENDAR CONTEXT`}
              onBack={() => setView("candidate")}
              onComplete={completePlannerDecision}
            />
          ) : null}

          {view === "quick-check" ? (
            <QuickCheckFlow
              key={`quick-${flowKey}`}
              initialActivity={quickStartActivity}
              onBack={openHome}
              onComplete={(nextDecision) => {
                setDecision(nextDecision);
                setSaved(false);
                setView("quick-result");
              }}
            />
          ) : null}

          {view === "quick-result" && decision ? (
            <DecisionResult
              decision={decision}
              saved={saved}
              onSave={saveCurrentDecision}
              onTryAnother={() => openQuickCheck()}
            />
          ) : null}

          {view === "planner-result" && decision && solver && snapshot && candidate ? (
            <DecisionResult
              decision={decision}
              saved={saved}
              planner={{
                selectedDate,
                candidateMinutes: candidate.minutes,
                solver,
                selectedPlanId,
                onSelectPlan: (planId) => {
                  setSelectedPlanId(planId);
                  setSaved(false);
                },
                onReturnToDay: () => setView("map"),
              }}
              onSave={saveCurrentDecision}
              onTryAnother={() => {
                resetDecision();
                setView("candidate");
              }}
            />
          ) : null}

          <Principles />
          <DecisionJournal
            entries={journal}
            onDelete={(id) => {
              const result = deleteJournalEntry(id);
              setJournal(result.value);
              handleStorageWarning(result.warning);
            }}
            onClear={() => {
              const result = clearJournal();
              setJournal(result.value);
              handleStorageWarning(result.warning);
            }}
          />
        </main>
        <Footer />
      </div>
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast ? <div className="toast">{toast}</div> : null}
      </div>
    </div>
  );
}
