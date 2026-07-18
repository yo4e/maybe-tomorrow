import { useMemo, useState, type FormEvent } from "react";
import {
  addCivilDays,
  classificationFor,
  computeDayMetrics,
  createPlanningWindow,
  normalizeClassification,
  occurrencesOnDate,
  type ClassificationMap,
} from "../calendar/day";
import type {
  CalendarImportWarning,
  CalendarOccurrence,
  CalendarWindow,
  EventClassification,
  TimedCalendarOccurrence,
} from "../calendar/types";

export type PlannerSnapshot = {
  id: string;
  name: string;
  source: "demo" | "import";
  importedAt: string;
  window: CalendarWindow;
  occurrences: CalendarOccurrence[];
  warnings: CalendarImportWarning[];
};

export type CalendarTriageProps = {
  snapshot: PlannerSnapshot;
  selectedDate: string;
  classifications: ClassificationMap;
  onDateChange: (date: string) => void;
  onClassify: (eventId: string, classification: EventClassification) => void;
  onBack: () => void;
  onContinue: () => void;
};

function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}

function formatMinutes(minutes: number): string {
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

function dateHeading(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function EventTime({ event }: { event: CalendarOccurrence }) {
  if (event.kind === "all-day") return <span>All day</span>;
  return (
    <span>
      {formatTime(event.startMs)}–{formatTime(event.endMs)}
    </span>
  );
}

function classificationLabels(classification: EventClassification): string[] {
  const labels: string[] = [];
  if (classification.recovery) labels.push("Recovery");
  else if (classification.fixed) labels.push("Fixed");
  else if (classification.movable) labels.push("Movable");
  if (classification.reducible) labels.push("Reducible");
  if (classification.highEnergy) labels.push("High energy");
  return labels;
}

function ClassificationControls({
  event,
  value,
  onChange,
}: {
  event: CalendarOccurrence;
  value: EventClassification;
  onChange: (value: EventClassification) => void;
}) {
  const mobility = value.fixed ? "fixed" : value.movable ? "movable" : "neutral";
  const setMobility = (next: "neutral" | "fixed" | "movable") => {
    onChange(
      normalizeClassification({
        ...value,
        fixed: next === "fixed",
        movable: next === "movable",
        recovery: next === "fixed" ? value.recovery : false,
      }),
    );
  };

  return (
    <fieldset className="classification-controls">
      <legend className="visually-hidden">Labels for {event.title}</legend>
      <div className="mobility-control" role="group" aria-label="Can this event move?">
        {(["neutral", "fixed", "movable"] as const).map((option) => (
          <button
            className={mobility === option ? "label-button is-active" : "label-button"}
            type="button"
            aria-pressed={mobility === option}
            key={option}
            onClick={() => setMobility(option)}
          >
            {option === "neutral" ? "Unlabelled" : option[0]!.toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
      <div className="attribute-controls">
        <label>
          <input
            type="checkbox"
            checked={value.reducible}
            disabled={value.recovery}
            onChange={(change) =>
              onChange(normalizeClassification({ ...value, reducible: change.target.checked }))
            }
          />
          <span>Reducible</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={value.highEnergy}
            onChange={(change) =>
              onChange(normalizeClassification({ ...value, highEnergy: change.target.checked }))
            }
          />
          <span>High energy</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={value.recovery}
            onChange={(change) =>
              onChange(normalizeClassification({ ...value, recovery: change.target.checked }))
            }
          />
          <span>Recovery</span>
        </label>
      </div>
    </fieldset>
  );
}

function SnapshotDatePicker({
  snapshot,
  selectedDate,
  onChange,
}: {
  snapshot: PlannerSnapshot;
  selectedDate: string;
  onChange: (date: string) => void;
}) {
  return (
    <label className="snapshot-date-picker">
      <span>Day in this snapshot</span>
      <input
        type="date"
        value={selectedDate}
        min={snapshot.window.startDate}
        max={addCivilDays(snapshot.window.endDateExclusive, -1)}
        onChange={(event) => {
          if (event.target.value) onChange(event.target.value);
        }}
      />
    </label>
  );
}

export function CalendarTriage({
  snapshot,
  selectedDate,
  classifications,
  onDateChange,
  onClassify,
  onBack,
  onContinue,
}: CalendarTriageProps) {
  const occurrences = occurrencesOnDate(snapshot.occurrences, selectedDate);
  const labelledCount = occurrences.filter(
    (event) => classificationLabels(classificationFor(classifications, event.id)).length > 0,
  ).length;

  return (
    <section className="triage-panel panel-wide" aria-labelledby="triage-heading">
      <button className="back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Change snapshot
      </button>
      <div className="triage-heading-row">
        <div>
          <div className="eyebrow">HUMAN CLASSIFICATION</div>
          <h1 id="triage-heading" data-stage-focus tabIndex={-1}>
            Tell the app what the titles cannot.
          </h1>
          <p className="lede">
            The app knows only times. You decide what is fixed, movable,
            reducible, energy-heavy, or protected recovery.
          </p>
        </div>
        <SnapshotDatePicker
          snapshot={snapshot}
          selectedDate={selectedDate}
          onChange={onDateChange}
        />
      </div>

      {snapshot.source === "demo" ? (
        <p className="demo-note">
          This fictional day arrives pre-labelled for the demo. Change any label
          to see the map and solver respond.
        </p>
      ) : (
        <p className="demo-note">
          Imported events start unlabelled. Leaving one neutral is a valid choice;
          the solver will not volunteer it for changes.
        </p>
      )}

      <div className="triage-progress" role="status">
        {labelledCount} of {occurrences.length} events have at least one human label.
      </div>

      {occurrences.length === 0 ? (
        <div className="empty-day">
          <h2>No events found on {dateHeading(selectedDate)}.</h2>
          <p>Choose another date inside the imported seven-day window.</p>
        </div>
      ) : (
        <ol className="triage-list">
          {occurrences.slice(0, 150).map((event) => (
            <li className="triage-event" key={event.id}>
              <div className="triage-event-main">
                <EventTime event={event} />
                <h2>{event.title}</h2>
                <small>{event.calendarName}</small>
              </div>
              <ClassificationControls
                event={event}
                value={classificationFor(classifications, event.id)}
                onChange={(classification) => onClassify(event.id, classification)}
              />
            </li>
          ))}
        </ol>
      )}

      {occurrences.length > 150 ? (
        <p className="import-warning">
          Only the first 150 events are shown for labelling. The remaining events
          stay neutral and still appear as time constraints.
        </p>
      ) : null}
      <div className="sticky-actions">
        <button className="button button-primary" type="button" onClick={onContinue}>
          See the Today Map <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

type AgendaRow =
  | { kind: "gap"; id: string; startMs: number; endMs: number; minutes: number }
  | { kind: "event"; event: TimedCalendarOccurrence; overlapping: boolean };

function buildAgendaRows(
  events: TimedCalendarOccurrence[],
  date: string,
): AgendaRow[] {
  const window = createPlanningWindow(date);
  const sorted = [...events].sort(
    (left, right) => left.startMs - right.startMs || left.endMs - right.endMs,
  );
  const rows: AgendaRow[] = [];
  let cursor = window.startMs;

  for (const event of sorted) {
    const start = Math.max(event.startMs, window.startMs);
    const end = Math.min(event.endMs, window.endMs);
    if (end <= start) continue;
    if (start > cursor) {
      rows.push({
        kind: "gap",
        id: `gap-${cursor}-${start}`,
        startMs: cursor,
        endMs: start,
        minutes: Math.round((start - cursor) / 60_000),
      });
    }
    rows.push({ kind: "event", event, overlapping: start < cursor });
    cursor = Math.max(cursor, end);
  }

  if (cursor < window.endMs) {
    rows.push({
      kind: "gap",
      id: `gap-${cursor}-${window.endMs}`,
      startMs: cursor,
      endMs: window.endMs,
      minutes: Math.round((window.endMs - cursor) / 60_000),
    });
  }
  return rows;
}

function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

export type TodayMapProps = {
  snapshot: PlannerSnapshot;
  selectedDate: string;
  classifications: ClassificationMap;
  onDateChange: (date: string) => void;
  onEditLabels: () => void;
  onAddActivity: () => void;
  onChangeSnapshot: () => void;
};

export function TodayMap({
  snapshot,
  selectedDate,
  classifications,
  onDateChange,
  onEditLabels,
  onAddActivity,
  onChangeSnapshot,
}: TodayMapProps) {
  const occurrences = useMemo(
    () => occurrencesOnDate(snapshot.occurrences, selectedDate),
    [snapshot.occurrences, selectedDate],
  );
  const metrics = useMemo(
    () => computeDayMetrics(snapshot.occurrences, classifications, selectedDate),
    [snapshot.occurrences, classifications, selectedDate],
  );
  const timed = occurrences.filter(
    (event): event is TimedCalendarOccurrence => event.kind === "timed",
  );
  const allDay = occurrences.filter((event) => event.kind === "all-day");
  const rows = buildAgendaRows(timed, selectedDate);

  return (
    <section className="map-panel panel-wide" aria-labelledby="map-heading">
      <div className="map-heading-row">
        <div>
          <div className="eyebrow">TODAY MAP · {metrics.pressure.toUpperCase()}</div>
          <h1 id="map-heading" data-stage-focus tabIndex={-1}>
            {dateHeading(selectedDate)}
          </h1>
          <p className="snapshot-name">{snapshot.name}</p>
        </div>
        <SnapshotDatePicker
          snapshot={snapshot}
          selectedDate={selectedDate}
          onChange={onDateChange}
        />
      </div>

      <dl className="day-metrics">
        <Metric label="Occupied" value={formatMinutes(metrics.occupiedMinutes)} note="overlaps counted once" />
        <Metric label="Longest opening" value={formatMinutes(metrics.longestOpenMinutes)} />
        <Metric label="Overlap" value={formatMinutes(metrics.overlapMinutes)} />
        <Metric label="Protected recovery" value={formatMinutes(metrics.protectedRecoveryMinutes)} />
      </dl>

      <div className="map-layout">
        <div className="agenda-column">
          <div className="agenda-heading">
            <div>
              <h2>The day, in order</h2>
              <p>Planning window: 7 AM–9 PM. Openings are facts, not assignments.</p>
            </div>
            <button className="quiet-button" type="button" onClick={onEditLabels}>
              Edit human labels
            </button>
          </div>

          {allDay.length > 0 ? (
            <div className="all-day-group">
              <span>ALL DAY · NOT COUNTED AS 24 HOURS OF LOAD</span>
              <ul>
                {allDay.map((event) => <li key={event.id}>{event.title}</li>)}
              </ul>
            </div>
          ) : null}

          <ol className="agenda-list">
            {rows.map((row) => {
              if (row.kind === "gap") {
                return (
                  <li className={`agenda-gap ${row.minutes < 30 ? "is-small" : ""}`} key={row.id}>
                    <time>{formatTime(row.startMs)}</time>
                    <div>
                      <span>Open · {formatMinutes(row.minutes)}</span>
                      <small>{formatTime(row.startMs)}–{formatTime(row.endMs)}</small>
                    </div>
                  </li>
                );
              }
              const labels = classificationLabels(classificationFor(classifications, row.event.id));
              return (
                <li className="agenda-event" key={row.event.id}>
                  <time dateTime={new Date(row.event.startMs).toISOString()}>
                    {formatTime(row.event.startMs)}
                  </time>
                  <article>
                    <div className="agenda-event-title">
                      <h3>{row.event.title}</h3>
                      <span>{formatTime(row.event.startMs)}–{formatTime(row.event.endMs)}</span>
                    </div>
                    <div className="status-chips">
                      {row.overlapping ? <span className="chip chip-overlap">Overlap</span> : null}
                      {labels.length === 0 ? <span className="chip">Unlabelled</span> : null}
                      {labels.map((label) => (
                        <span className={`chip chip-${label.toLowerCase().replace(" ", "-")}`} key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className="day-reading" aria-labelledby="reading-heading">
          <span className="reading-state">{metrics.pressure}</span>
          <h2 id="reading-heading">
            {metrics.pressure === "overfull"
              ? "This day is already negotiating with itself."
              : metrics.pressure === "full"
                ? "There is room, but not much slack."
                : "The day still has breathing room."}
          </h2>
          <ul>
            <li>{metrics.fixedCount} fixed</li>
            <li>{metrics.movableCount} movable</li>
            <li>{metrics.reducibleCount} reducible</li>
            <li>{metrics.highEnergyCount} high-energy</li>
            <li>{metrics.fragmentedGapCount} short fragmented openings</li>
          </ul>
          <p>
            This reading uses only event times and the labels shown on this page.
            Titles are display text, never evidence.
          </p>
          <button className="button button-primary" type="button" onClick={onAddActivity}>
            Question one more addition <span aria-hidden="true">→</span>
          </button>
          <button className="text-action" type="button" onClick={onChangeSnapshot}>
            Use a different snapshot
          </button>
        </aside>
      </div>

      {snapshot.warnings.length > 0 ? (
        <details className="import-warnings">
          <summary>{snapshot.warnings.length} import note{snapshot.warnings.length === 1 ? "" : "s"}</summary>
          <ul>
            {snapshot.warnings.map((warning, index) => (
              <li key={`${warning.code}-${index}`}>{warning.message}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

export type CandidateSetupProps = {
  onBack: () => void;
  onContinue: (activity: string, minutes: number) => void;
};

export function CandidateSetup({ onBack, onContinue }: CandidateSetupProps) {
  const [activity, setActivity] = useState("");
  const [minutes, setMinutes] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const durationOptions = [15, 30, 45, 60, 90, 120];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clean = activity.trim();
    if (!clean) {
      setError("Name the addition before asking the day to absorb it.");
      return;
    }
    if (clean.length > 80) {
      setError("Keep the name under 80 characters.");
      return;
    }
    onContinue(clean, minutes);
  };

  return (
    <section className="candidate-panel decision-panel panel" aria-labelledby="candidate-heading">
      <button className="back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back to Today Map
      </button>
      <div className="eyebrow">ONE POSSIBLE ADDITION</div>
      <h1 id="candidate-heading" data-stage-focus tabIndex={-1}>
        What are you asking this day to hold?
      </h1>
      <form onSubmit={submit} noValidate>
        <label className="input-label" htmlFor="candidate-activity">The thing</label>
        <input
          className="activity-input"
          id="candidate-activity"
          value={activity}
          maxLength={120}
          placeholder="Draft a new story idea"
          onChange={(event) => {
            setActivity(event.target.value);
            if (error) setError(null);
          }}
        />
        <fieldset className="duration-fieldset">
          <legend>How much uninterrupted time would it honestly need?</legend>
          <div className="duration-options">
            {durationOptions.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="candidate-duration"
                  value={option}
                  checked={minutes === option}
                  onChange={() => setMinutes(option)}
                />
                <span>{formatMinutes(option)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="step-support">
          Duration is asked only in calendar mode. The app will not guess it
          from the activity name or energy answer.
        </p>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="button button-primary" type="submit">
          Start the Quick Check <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}
