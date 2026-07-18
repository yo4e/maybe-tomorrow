import { useEffect, useMemo, useRef, useState } from "react";
import { VERDICT_COPY } from "../domain/explanations";
import type {
  JournalDayContext,
  JournalEntry,
} from "../storage/journal";

export type DecisionJournalProps = {
  entries: JournalEntry[];
  onDelete: (id: string) => void;
  onClear: () => void;
};

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

function DayContext({ context }: { context: JournalDayContext }) {
  const selectedDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeZone: "UTC",
      }),
    [],
  );
  const selectedDate = new Date(`${context.selectedDate}T00:00:00Z`);

  return (
    <div className="journal-day-context">
      <p className="journal-snapshot">
        <span className="journal-context-label">Calendar used</span>{" "}
        <strong>{context.snapshotName}</strong>
        {" · "}
        <time dateTime={context.selectedDate}>
          {selectedDateFormatter.format(selectedDate)}
        </time>
      </p>

      <dl className="journal-metrics">
        <div className="journal-metric">
          <dt>Events</dt>
          <dd>{context.metrics.eventCount}</dd>
        </div>
        <div className="journal-metric">
          <dt>Occupied</dt>
          <dd>{formatMinutes(context.metrics.occupiedMinutes)}</dd>
        </div>
        <div className="journal-metric">
          <dt>Free</dt>
          <dd>{formatMinutes(context.metrics.freeMinutes)}</dd>
        </div>
        <div className="journal-metric">
          <dt>Overlapping</dt>
          <dd>{formatMinutes(context.metrics.overlapMinutes)}</dd>
        </div>
        <div className="journal-metric">
          <dt>Short gaps under 1 hour</dt>
          <dd>{context.metrics.fragmentedGapCount}</dd>
        </div>
        <div className="journal-metric">
          <dt>Protected recovery</dt>
          <dd>{formatMinutes(context.metrics.protectedRecoveryMinutes)}</dd>
        </div>
        <div className="journal-metric journal-metric-candidate">
          <dt>Time requested</dt>
          <dd>{formatMinutes(context.candidateMinutes)}</dd>
        </div>
      </dl>

      {context.selectedPlan ? (
        <div className="journal-selected-plan">
          <h4>Saved room-making option</h4>
          <p>{context.selectedPlan.summary}</p>
          {context.selectedPlan.operations.length > 0 ? (
            <ul>
              {context.selectedPlan.operations.map((operation, index) => (
                <li key={`${index}-${operation}`}>{operation}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="journal-no-plan">No room-making option was saved.</p>
      )}
    </div>
  );
}

export function DecisionJournal({
  entries,
  onDelete,
  onClear,
}: DecisionJournalProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const clearTriggerRef = useRef<HTMLButtonElement>(null);
  const keepButtonRef = useRef<HTMLButtonElement>(null);
  const savedDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [],
  );

  useEffect(() => {
    if (confirmingClear) {
      keepButtonRef.current?.focus();
    }
  }, [confirmingClear]);

  const cancelClear = () => {
    setConfirmingClear(false);
    window.requestAnimationFrame(() => clearTriggerRef.current?.focus());
  };

  return (
    <section
      className="journal-section section-block"
      id="journal"
      aria-labelledby="journal-heading"
    >
      <div className="journal-heading-row section-heading-row">
        <div>
          <div className="eyebrow">SAVED IN THIS BROWSER</div>
          <h2 id="journal-heading">Decision journal</h2>
          <p className="journal-intro">
            A private record of the things you did not automatically say yes to.
          </p>
        </div>
        {entries.length > 0 && !confirmingClear ? (
          <button
            className="journal-clear-trigger quiet-button"
            ref={clearTriggerRef}
            type="button"
            onClick={() => setConfirmingClear(true)}
          >
            Clear journal
          </button>
        ) : null}
      </div>

      <p className="journal-count" aria-live="polite" aria-atomic="true">
        {entries.length === 1
          ? "1 saved decision in this browser."
          : `${entries.length} saved decisions in this browser.`}
      </p>

      {confirmingClear ? (
        <div
          className="journal-clear-confirmation clear-confirmation"
          role="group"
          aria-labelledby="journal-clear-heading"
          aria-describedby="journal-clear-description"
        >
          <div>
            <h3 id="journal-clear-heading">Clear every saved decision?</h3>
            <p id="journal-clear-description">
              This only removes the journal from this browser. It cannot be undone.
            </p>
          </div>
          <div className="journal-clear-actions compact-actions">
            <button
              className="button button-danger"
              type="button"
              onClick={() => {
                onClear();
                setConfirmingClear(false);
              }}
            >
              Clear journal
            </button>
            <button
              className="button button-secondary"
              ref={keepButtonRef}
              type="button"
              onClick={cancelClear}
            >
              Keep decisions
            </button>
          </div>
        </div>
      ) : null}

      {entries.length === 0 ? (
        <p className="journal-empty empty-history">
          Nothing saved yet. A suspiciously productive situation.
        </p>
      ) : (
        <ol className="journal-list">
          {entries.map((entry) => {
            const verdictCopy = VERDICT_COPY[entry.decision.verdict];
            return (
              <li className="journal-item" key={entry.id}>
                <article className="journal-card">
                  <div className="journal-card-topline">
                    <span className="journal-kind">
                      {entry.kind === "day-plan" ? "With calendar context" : "Quick Check"}
                    </span>
                    <span
                      className={`journal-verdict journal-verdict-${entry.decision.verdict}`}
                    >
                      {verdictCopy.historyLabel}
                    </span>
                  </div>

                  <h3>{entry.decision.activity}</h3>
                  <p className="journal-saved-at">
                    Saved{" "}
                    <time dateTime={entry.savedAt}>
                      {savedDateFormatter.format(new Date(entry.savedAt))}
                    </time>
                  </p>

                  {entry.kind === "day-plan" ? (
                    <DayContext context={entry.dayContext} />
                  ) : null}

                  <div className="journal-item-actions">
                    <button
                      className="journal-delete delete-button"
                      type="button"
                      aria-label={`Delete saved decision for ${entry.decision.activity}`}
                      onClick={() => onDelete(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
