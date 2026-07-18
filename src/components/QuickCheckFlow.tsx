import { useEffect, useState, type FormEvent } from "react";
import { QUESTIONS, type QuestionDefinition } from "../domain/questions";
import { createDecision } from "../domain/scoring";
import type {
  Decision,
  PrimaryDecisionInputs,
  ScoreValue,
} from "../domain/types";

type FlowStage = "activity" | "questions" | "shrink";

type QuickCheckFlowProps = {
  initialActivity?: string;
  contextLabel?: string;
  onBack: () => void;
  onComplete: (decision: Decision) => void;
};

function hasCompleteAnswers(
  answers: Partial<PrimaryDecisionInputs>,
): answers is PrimaryDecisionInputs {
  return QUESTIONS.every((question) => answers[question.key] !== undefined);
}

function ActivityStep({
  initialValue,
  contextLabel,
  onBack,
  onSubmit,
}: {
  initialValue: string;
  contextLabel: string | undefined;
  onBack: () => void;
  onSubmit: (activity: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const remaining = 80 - value.trim().length;

  const submitValue = () => {
    const cleanValue = value.trim();
    if (!cleanValue) {
      setError("Name the thing first. We cannot postpone a mystery.");
      return;
    }
    if (cleanValue.length > 80) {
      setError("Keep it under 80 characters. The full project plan can wait too.");
      return;
    }
    setError(null);
    onSubmit(cleanValue);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitValue();
  };

  return (
    <section className="decision-panel panel" aria-labelledby="activity-heading">
      <button className="back-button" type="button" onClick={onBack}>
        <span aria-hidden="true">←</span> Back
      </button>
      <div className="eyebrow">{contextLabel ?? "ONE THING AT A TIME"}</div>
      <h1 id="activity-heading">What are you about to add to today?</h1>
      <p className="step-support">
        A task, outing, workout, favor, idea, or entirely new project you
        suddenly believe is urgent.
      </p>
      <form onSubmit={submit} noValidate>
        <label className="input-label" htmlFor="activity">
          The thing
        </label>
        <input
          className="activity-input"
          data-stage-focus
          id="activity"
          type="text"
          value={value}
          maxLength={120}
          placeholder="Start another side project"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "activity-error" : "activity-support"}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submitValue();
            }
          }}
        />
        <div className="input-meta" id="activity-support">
          <span>Keep it specific.</span>
          {remaining <= 20 ? (
            <span className={remaining < 0 ? "character-count over-limit" : "character-count"}>
              {remaining} characters left
            </span>
          ) : null}
        </div>
        {error ? (
          <p className="form-error" id="activity-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="button button-primary full-width-mobile" type="submit">
          Start Quick Check <span aria-hidden="true">→</span>
        </button>
      </form>
    </section>
  );
}

function QuestionStep({
  question,
  questionIndex,
  selected,
  onSelect,
  onBack,
  onContinue,
}: {
  question: QuestionDefinition;
  questionIndex: number;
  selected: ScoreValue | undefined;
  onSelect: (value: ScoreValue) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="decision-panel panel">
      <div className="step-topline">
        <button className="back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="progress-label">Question {questionIndex + 1} of 8</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${((questionIndex + 1) / 8) * 100}%` }} />
      </div>
      <fieldset className="question-fieldset">
        <legend data-stage-focus tabIndex={-1}>
          {question.heading}
        </legend>
        <div className="choices">
          {question.options.map((item) => {
            const id = `${question.key}-${item.value}`;
            return (
              <label className="choice" htmlFor={id} key={item.value}>
                <input
                  className="choice-input"
                  id={id}
                  name={question.key}
                  type="radio"
                  value={item.value}
                  checked={selected === item.value}
                  onChange={() => onSelect(item.value)}
                />
                <span className="choice-card">
                  <span>{item.label}</span>
                  <span className="choice-mark" aria-hidden="true">
                    {selected === item.value ? "✓" : ""}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="step-actions">
        <button
          className="button button-primary"
          type="button"
          disabled={selected === undefined}
          onClick={onContinue}
        >
          Continue <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

function ShrinkStep({
  selected,
  onSelect,
  onBack,
  onComplete,
}: {
  selected: boolean | null;
  onSelect: (value: boolean) => void;
  onBack: () => void;
  onComplete: () => void;
}) {
  const options = [
    { value: true, label: "Yes, probably" },
    { value: false, label: "No, not really" },
  ];

  return (
    <section className="decision-panel panel">
      <div className="step-topline">
        <button className="back-button" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> Back
        </button>
        <span className="progress-label">Question 8 of 8</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: "100%" }} />
      </div>
      <fieldset className="question-fieldset">
        <legend data-stage-focus tabIndex={-1}>
          Could you make it meaningfully smaller?
        </legend>
        <p className="step-support">
          Shorter, closer, simpler, cheaper, or involving fewer people.
        </p>
        <div className="choices choices-short">
          {options.map((item) => {
            const id = `shrink-${String(item.value)}`;
            return (
              <label className="choice" htmlFor={id} key={id}>
                <input
                  className="choice-input"
                  id={id}
                  name="shrinkable"
                  type="radio"
                  checked={selected === item.value}
                  onChange={() => onSelect(item.value)}
                />
                <span className="choice-card">
                  <span>{item.label}</span>
                  <span className="choice-mark" aria-hidden="true">
                    {selected === item.value ? "✓" : ""}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="step-actions">
        <button
          className="button button-primary"
          type="button"
          disabled={selected === null}
          onClick={onComplete}
        >
          See my result <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

export function QuickCheckFlow({
  initialActivity = "",
  contextLabel,
  onBack,
  onComplete,
}: QuickCheckFlowProps) {
  const [stage, setStage] = useState<FlowStage>(
    initialActivity ? "questions" : "activity",
  );
  const [activity, setActivity] = useState(initialActivity);
  const [answers, setAnswers] = useState<Partial<PrimaryDecisionInputs>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [shrinkable, setShrinkable] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("[data-stage-focus]")?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [stage, questionIndex]);

  const currentQuestion = QUESTIONS[questionIndex];

  if (stage === "activity") {
    return (
      <ActivityStep
        initialValue={activity}
        contextLabel={contextLabel}
        onBack={onBack}
        onSubmit={(nextActivity) => {
          setActivity(nextActivity);
          setStage("questions");
        }}
      />
    );
  }

  if (stage === "questions" && currentQuestion) {
    return (
      <QuestionStep
        question={currentQuestion}
        questionIndex={questionIndex}
        selected={answers[currentQuestion.key]}
        onSelect={(value) =>
          setAnswers((current) => ({
            ...current,
            [currentQuestion.key]: value,
          }))
        }
        onBack={() => {
          if (questionIndex === 0) {
            if (initialActivity) onBack();
            else setStage("activity");
          } else {
            setQuestionIndex((index) => index - 1);
          }
        }}
        onContinue={() => {
          if (answers[currentQuestion.key] === undefined) return;
          if (questionIndex === QUESTIONS.length - 1) setStage("shrink");
          else setQuestionIndex((index) => index + 1);
        }}
      />
    );
  }

  return (
    <ShrinkStep
      selected={shrinkable}
      onSelect={setShrinkable}
      onBack={() => {
        setQuestionIndex(QUESTIONS.length - 1);
        setStage("questions");
      }}
      onComplete={() => {
        if (shrinkable === null || !hasCompleteAnswers(answers)) return;
        onComplete(createDecision(activity, { ...answers, shrinkable }));
      }}
    />
  );
}
