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

type ClassificationLabel = {
  text: string;
  tone: "recovery" | "fixed" | "movable" | "reducible" | "high-energy";
};

function classificationLabels(classification: EventClassification): ClassificationLabel[] {
  const labels: ClassificationLabel[] = [];
  if (classification.recovery) labels.push({ text: "Protected recovery", tone: "recovery" });
  else if (classification.fixed) labels.push({ text: "Must stay", tone: "fixed" });
  else if (classification.movable) labels.push({ text: "Can move", tone: "movable" });
  if (classification.reducible) labels.push({ text: "Can be shorter", tone: "reducible" });
  if (classification.highEnergy) {
    labels.push({ text: "Takes a lot of energy", tone: "high-energy" });
  }
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
  const mobilityLabels = {
    neutral: "Not sure",
    fixed: "Must stay",
    movable: "Can move",
  } as const;
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
            {mobilityLabels[option]}
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
          <span>Can be shorter</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={value.highEnergy}
            onChange={(change) =>
              onChange(normalizeClassification({ ...value, highEnergy: change.target.checked }))
            }
          />
          <span>Takes a lot of energy</span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={value.recovery}
            onChange={(change) =>
              onChange(normalizeClassification({ ...value, recovery: change.target.checked }))
            }
          />
          <span>Protected recovery</span>
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
      <span>Date to view</span>
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
        <span aria-hidden="true">←</span> Choose another calendar file
      </button>
      <div className="triage-heading-row">
        <div>
          <div className="eyebrow">MARK WHAT CAN MOVE</div>
          <h1 id="triage-heading" data-stage-focus tabIndex={-1}>
            Mark what can move.
          </h1>
          <p className="lede">
            The app sees event times, not meaning. Mark what must stay, can
            move, can be shorter, takes a lot of energy, or protects recovery.
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
          This sample day is already marked. Change any label to see the day
          view and room-making options update.
        </p>
      ) : (
        <p className="demo-note">
          Imported events start as “Not sure.” If you leave one that way, the
          app will never suggest changing it.
        </p>
      )}

      <div className="triage-progress" role="status">
        {labelledCount} of {occurrences.length} events marked.
      </div>

      {occurrences.length === 0 ? (
        <div className="empty-day">
          <h2>No events found on {dateHeading(selectedDate)}.</h2>
          <p>Choose another date from the imported week.</p>
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
          Only the first 150 events are shown here. Events not shown remain
          unchanged and still count as occupied time.
        </p>
      ) : null}
      <div className="sticky-actions">
        <button className="button button-primary" type="button" onClick={onContinue}>
          See this day <span aria-hidden="true">→</span>
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
          <div className="eyebrow">TODAY MAP</div>
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
        <Metric label="Time with events" value={formatMinutes(metrics.occupiedMinutes)} note="overlapping events count once" />
        <Metric label="Longest opening" value={formatMinutes(metrics.longestOpenMinutes)} />
        <Metric label="Overlapping time" value={formatMinutes(metrics.overlapMinutes)} />
        <Metric label="Protected recovery" value={formatMinutes(metrics.protectedRecoveryMinutes)} />
      </dl>

      <div className="map-layout">
        <div className="agenda-column">
          <div className="agenda-heading">
            <div>
              <h2>The day, in order</h2>
              <p>Times shown: 7 AM–9 PM. Openings are facts, not assignments.</p>
            </div>
            <button className="quiet-button" type="button" onClick={onEditLabels}>
              Change event labels
            </button>
          </div>

          {allDay.length > 0 ? (
            <div className="all-day-group">
              <span>ALL-DAY EVENTS · SHOWN SEPARATELY FROM TIMED EVENTS</span>
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
                      {labels.length === 0 ? <span className="chip">Not sure</span> : null}
                      {labels.map((label) => (
                        <span className={`chip chip-${label.tone}`} key={label.tone}>
                          {label.text}
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
          <span className="reading-state">AT A GLANCE</span>
          <h2 id="reading-heading">
            {metrics.overlapMinutes > 0
              ? "Some events overlap."
              : metrics.longestOpenMinutes < 60
                ? "No open block reaches one hour."
                : "At least one open block is an hour or longer."}
          </h2>
          <ul>
            <li>{metrics.fixedCount} marked “Must stay”</li>
            <li>{metrics.movableCount} marked “Can move”</li>
            <li>{metrics.reducibleCount} marked “Can be shorter”</li>
            <li>{metrics.highEnergyCount} marked “Takes a lot of energy”</li>
            <li>{metrics.fragmentedGapCount} short gaps under one hour</li>
          </ul>
          <p>
            This view uses only event times and the labels you chose. No AI reads
            your calendar. We can see the time. Only you know what it means.
          </p>
          <button className="button button-primary" type="button" onClick={onAddActivity}>
            Check one thing <span aria-hidden="true">→</span>
          </button>
          <button className="text-action" type="button" onClick={onChangeSnapshot}>
            Use a different calendar file
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
  initialActivity?: string;
  onBack: () => void;
  onContinue: (activity: string, minutes: number) => void;
};

export function CandidateSetup({
  initialActivity = "",
  onBack,
  onContinue,
}: CandidateSetupProps) {
  const [activity, setActivity] = useState(initialActivity);
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
        <span aria-hidden="true">←</span> Back to this day
      </button>
      <div className="eyebrow">ONE POSSIBLE ADDITION</div>
      <h1 id="candidate-heading" data-stage-focus tabIndex={-1}>
        What do you want to add?
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
          <legend>How much uninterrupted time would it need?</legend>
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
          We ask for duration only when calendar context is added. The app will
          not guess it from the activity name or energy answer.
        </p>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="button button-primary" type="submit">
          Start the Quick Check <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}
