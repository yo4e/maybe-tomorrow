import { useId, useState, type FormEvent } from "react";

export type HomeProps = {
  initialActivity?: string;
  onTryDemo: (activity: string) => void;
  onImport: (activity: string) => void;
  onQuickCheck: (activity: string) => void;
};

export function Home({ initialActivity = "", onTryDemo, onImport, onQuickCheck }: HomeProps) {
  const activityId = useId();
  const [activity, setActivity] = useState(initialActivity);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanActivity = activity.trim();
    if (!cleanActivity) {
      setError("Name the thing first. We cannot postpone a mystery.");
      return;
    }
    if (cleanActivity.length > 80) {
      setError("Keep it under 80 characters. The full project plan can wait too.");
      return;
    }
    setError(null);
    onQuickCheck(cleanActivity);
  };

  return (
    <>
      <section className="hero panel-wide" aria-labelledby="hero-heading">
        <div className="hero-main">
          <div className="eyebrow">AN ANTI-PRODUCTIVITY DECISION APP</div>
          <h1 id="hero-heading">Does this really have to happen today?</h1>
          <p className="hero-copy">
            Name one thing you are considering. In under a minute, decide
            whether to do it, make it smaller, or leave it for tomorrow.
          </p>

          <form className="hero-quick-form" onSubmit={submit} noValidate>
            <label className="input-label" htmlFor={activityId}>
              What are you considering doing today?
            </label>
            <div className="hero-input-row">
              <input
                className="hero-activity-input"
                id={activityId}
                type="text"
                value={activity}
                maxLength={120}
                placeholder="Start another side project"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${activityId}-error` : `${activityId}-support`}
                onChange={(event) => {
                  setActivity(event.target.value);
                  if (error) setError(null);
                }}
              />
              <button className="button button-primary" type="submit">
                Check one thing <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="hero-input-note" id={`${activityId}-support`}>
              Seven questions, then one last check. No calendar required.
            </p>
            {error ? (
              <p className="form-error" id={`${activityId}-error`} role="alert">
                {error}
              </p>
            ) : null}
          </form>

          <div className="hero-secondary-paths" aria-label="Optional ways to add context">
            <button
              className="button button-secondary"
              type="button"
              onClick={() => onImport(activity)}
            >
              Add calendar context
            </button>
            <button
              className="text-action"
              type="button"
              onClick={() => onTryDemo(activity)}
            >
              Try the sample day
            </button>
          </div>
        </div>

        <aside className="privacy-card" aria-labelledby="privacy-card-heading">
          <span className="privacy-orbit" aria-hidden="true">OPTIONAL</span>
          <h2 id="privacy-card-heading">More context, only if it helps.</h2>
          <p className="privacy-lead">No AI reads your calendar.</p>
          <p>
            Add a local calendar file for a more grounded answer. We can see
            the time. Only you know what it means.
          </p>
          <ul className="plain-check-list">
            <li>Files stay in this browser</li>
            <li>Calendar context is never required</li>
            <li>Nothing is synchronized or edited</li>
          </ul>
        </aside>
      </section>

      <section className="three-steps section-block" aria-labelledby="three-steps-heading">
        <div>
          <div className="eyebrow">ONE DECISION, NOT A NEW SYSTEM</div>
          <h2 id="three-steps-heading">Start with the thing you are about to add.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <h3>Name one thing</h3>
            <p>A task, outing, favor, workout, or idea that wants a piece of today.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Answer honestly</h3>
            <p>Seven questions compare urgency and commitment with load, energy, and recovery.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Let the day answer</h3>
            <p>If one more thing enters today, what has to leave, shrink, or move?</p>
          </li>
        </ol>
      </section>

      <section className="story-section section-block" aria-labelledby="story-heading">
        <div className="eyebrow">WHY THIS EXISTS</div>
        <h2 id="story-heading">Some people need a gentler kind of friction.</h2>
        <details className="story-disclosure">
          <summary>Read Yoshie Yamada’s origin story</summary>
          <div className="story-copy">
            <p>
              Yoshie is a writer, parent, independent worker, and creator. In
              2025, after trying to carry work, family, and creative life at
              full speed, she was taken to the emergency department. She kept
              adding interesting work and projects anyway. Exactly six months
              later, it happened again.
            </p>
            <p>
              She did not need another voice saying, “You can do it.” She
              needed someone to ask, “Does that really have to happen today?”
            </p>
          </div>
        </details>
      </section>
    </>
  );
}
