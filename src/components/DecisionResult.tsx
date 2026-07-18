import { useMemo, useState } from "react";
import {
  getFactorSentence,
  getReduceSuggestion,
  VERDICT_COPY,
} from "../domain/explanations";
import {
  findCounterfactuals,
  type CounterfactualAlternative,
} from "../domain/counterfactual";
import { QUESTIONS } from "../domain/questions";
import type { Decision, FactorKey, ScoreValue, Verdict } from "../domain/types";
import type {
  ReplacementPlan,
  ReplacementSolverResult,
} from "../planning/solver";

export type DecisionResultProps = {
  decision: Decision;
  saved: boolean;
  planner?: {
    selectedDate: string;
    candidateMinutes: number;
    solver: ReplacementSolverResult;
    selectedPlanId: string | null;
    onSelectPlan: (planId: string | null) => void;
    onReturnToDay: () => void;
  };
  onSave: () => void;
  onTryAnother: () => void;
};

const verdictHeading: Record<Verdict, string> = {
  postpone: "Maybe tomorrow.",
  reduce: "Make it smaller.",
  proceed: "Okay. One thing only.",
};

function optionLabel(factor: FactorKey, value: ScoreValue): string {
  return QUESTIONS.find((question) => question.key === factor)?.options.find(
    (option) => option.value === value,
  )?.label ?? String(value);
}

function factorLabel(factor: FactorKey): string {
  const headings: Record<FactorKey, string> = {
    urgency: "Urgency",
    commitment: "Commitment to others",
    desire: "Genuine desire",
    energyCost: "Energy cost",
    dayLoad: "Today’s load",
    recoveryNeed: "Recovery need",
    tomorrowFlexibility: "Ability to wait",
  };
  return headings[factor];
}

function CounterfactualCard({
  alternative,
  originalScore,
}: {
  alternative: CounterfactualAlternative;
  originalScore: number;
}) {
  return (
    <li className="counterfactual-card">
      <ul className="counterfactual-changes">
        {alternative.changes.map((change) => (
          <li key={change.factor}>
            <span>{factorLabel(change.factor)}</span>
            <strong>
              {optionLabel(change.factor, change.from)} → {optionLabel(change.factor, change.to)}
            </strong>
          </li>
        ))}
      </ul>
      <p>
        The score moves from {originalScore} to {alternative.targetScore} and reaches{" "}
        <strong>{verdictHeading[alternative.verdict]}</strong>
      </p>
    </li>
  );
}

function CostOfYes({ decision }: { decision: Decision }) {
  const [open, setOpen] = useState(false);
  const result = useMemo(
    () => findCounterfactuals(decision.inputs),
    [decision.inputs],
  );
  const protectiveDirection = decision.verdict === "proceed";

  return (
    <section className="cost-of-yes" aria-labelledby="cost-heading">
      <div>
        <div className="eyebrow">COUNTERFACTUAL, NOT ADVICE</div>
        <h2 id="cost-heading">
          {protectiveDirection ? "What would make this wait?" : "The cost of yes"}
        </h2>
        <p>
          {protectiveDirection
            ? "The nearest facts that would produce a more protective answer."
            : `The nearest facts that would reach “${verdictHeading[result.targetVerdict]}”`}
        </p>
      </div>
      <button
        className="button button-secondary"
        type="button"
        aria-expanded={open}
        aria-controls="counterfactual-details"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Hide the arithmetic" : "Show the arithmetic"}
      </button>
      {open ? (
        <div id="counterfactual-details" className="counterfactual-details">
          <p className="math-note">
            Deterministic search: all {result.searchedStates.toLocaleString()} possible
            answer combinations, including every scoring guardrail. Your original
            answers remain unchanged.
          </p>
          <ol className="counterfactual-list">
            {result.alternatives.map((alternative, index) => (
              <CounterfactualCard
                alternative={alternative}
                originalScore={result.originalScore}
                key={`${index}-${alternative.changes.map((change) => change.factor).join("-")}`}
              />
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}

function formatMinutes(minutes: number): string {
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const rest = rounded % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

function formatTime(ms: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}

function operationSentence(operation: ReplacementPlan["operations"][number]): string {
  if (operation.kind === "postpone") {
    return `Postpone “${operation.title}” (${formatMinutes(operation.changedMinutes)} released).`;
  }
  return `Keep the first half of “${operation.title}” and release ${formatMinutes(operation.changedMinutes)}.`;
}

function PlanOptions({
  solver,
  selectedPlanId,
  onSelectPlan,
}: {
  solver: ReplacementSolverResult;
  selectedPlanId: string | null;
  onSelectPlan: (id: string | null) => void;
}) {
  if (solver.fitsWithoutChanges) {
    const slot = solver.plans[0]?.availableSlot;
    return (
      <section className="replacement-section replacement-fits" aria-labelledby="replacement-heading">
        <div className="eyebrow">THE DAY, AS IT IS</div>
        <h2 id="replacement-heading">There is already one honest opening.</h2>
        <p>
          {slot
            ? `${formatTime(slot.startMs)}–${formatTime(slot.endMs)} is open in the 7 AM–9 PM planning window.`
            : "No calendar change is needed."}
          {" "}That is a fact about time, not a command to use it.
        </p>
      </section>
    );
  }

  return (
    <section className="replacement-section" aria-labelledby="replacement-heading">
      <div className="eyebrow">REPLACEMENT SOLVER</div>
      <h2 id="replacement-heading">Another way to make room</h2>
      <p>
        These are previews, not calendar edits. Fixed commitments and recovery
        are protected. The solver uses only times and labels you supplied.
      </p>
      {solver.plans.length > 0 ? (
        <div className="plan-grid">
          {solver.plans.map((plan, index) => {
            const selected = selectedPlanId === plan.id;
            return (
              <article className={`plan-card ${selected ? "is-selected" : ""}`} key={plan.id}>
                <span className="plan-number">WAY {index + 1}</span>
                <h3>
                  Change {plan.changedEventCount} {plan.changedEventCount === 1 ? "thing" : "things"}
                </h3>
                <ul>
                  {plan.operations.map((operation) => (
                    <li key={`${operation.eventId}-${operation.kind}`}>
                      {operationSentence(operation)}
                    </li>
                  ))}
                </ul>
                <p className="plan-slot">
                  Opens {formatTime(plan.availableSlot.startMs)}–{formatTime(plan.availableSlot.endMs)}.
                </p>
                <button
                  className={selected ? "button button-primary" : "button button-secondary"}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  {selected ? "Chosen for the journal" : "Choose this preview"}
                </button>
              </article>
            );
          })}
          <article className={`plan-card keep-plan ${selectedPlanId === null ? "is-selected" : ""}`}>
            <span className="plan-number">NO TRADE-OFF</span>
            <h3>Keep the day exactly as it is</h3>
            <p>It is valid to accept the verdict without rearranging anything.</p>
            <button
              className={selectedPlanId === null ? "button button-primary" : "button button-secondary"}
              type="button"
              aria-pressed={selectedPlanId === null}
              onClick={() => onSelectPlan(null)}
            >
              {selectedPlanId === null ? "Day left unchanged" : "Choose no change"}
            </button>
          </article>
        </div>
      ) : (
        <div className="no-plan-note">
          <h3>No small trade-off creates a large enough block.</h3>
          <p>{solver.noPlanReason?.message}</p>
        </div>
      )}
      <p className="solver-proof">
        Checked {solver.searchedSubsetCount.toLocaleString()} allowed combinations;
        ranked by fewest changed events, then least changed time.
      </p>
    </section>
  );
}

export function DecisionResult({
  decision,
  saved,
  planner,
  onSave,
  onTryAnother,
}: DecisionResultProps) {
  const copy = VERDICT_COPY[decision.verdict];

  return (
    <div className="result-stack">
      <section
        className={`result-card panel result-${decision.verdict}`}
        aria-labelledby="result-heading"
        aria-live="polite"
      >
        <div className="decision-stamp" aria-hidden="true">
          {decision.verdict === "postpone"
            ? "NOT TODAY"
            : decision.verdict === "reduce"
              ? "LESS, PLEASE"
              : "ONE THING"}
        </div>
        <div className="eyebrow">{copy.eyebrow}</div>
        <h1 id="result-heading" data-stage-focus tabIndex={-1}>
          {copy.heading}
        </h1>
        <p className="result-statement">
          <strong>{decision.activity}</strong>
          {copy.statement(decision.activity).slice(decision.activity.length)}
        </p>
        <p className="result-body">{copy.body}</p>
        {decision.verdict === "reduce" ? (
          <p className="reduce-suggestion">
            {getReduceSuggestion(decision.inputs.shrinkable)}
          </p>
        ) : null}

        <div className="factor-block">
          <h2>What pushed the decision</h2>
          <ul>
            {decision.factors.map((factor) => (
              <li key={factor}>{getFactorSentence(factor, decision.inputs)}</li>
            ))}
          </ul>
        </div>
      </section>

      <CostOfYes decision={decision} />
      {planner ? (
        <>
          <PlanOptions
            solver={planner.solver}
            selectedPlanId={planner.selectedPlanId}
            onSelectPlan={planner.onSelectPlan}
          />
          <button className="text-action return-to-day" type="button" onClick={planner.onReturnToDay}>
            <span aria-hidden="true">←</span> Return to Today Map
          </button>
        </>
      ) : null}

      <div className="result-actions final-actions">
        <button className="button button-primary" type="button" disabled={saved} onClick={onSave}>
          {saved ? "Decision saved locally" : "Save to the local journal"}
        </button>
        <button className="button button-secondary" type="button" onClick={onTryAnother}>
          {planner ? "Question another addition" : "Try another"}
        </button>
      </div>
    </div>
  );
}
