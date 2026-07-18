export type HomeProps = {
  onTryDemo: () => void;
  onImport: () => void;
  onQuickCheck: () => void;
};

export function Home({ onTryDemo, onImport, onQuickCheck }: HomeProps) {
  return (
    <>
      <section className="hero panel-wide" aria-labelledby="hero-heading">
        <div className="hero-main">
          <div className="eyebrow">A LOCAL-FIRST ANTI-PLANNER</div>
          <h1 id="hero-heading">You do not need help fitting in more.</h1>
          <p className="hero-copy">
            See what today is already carrying. Then decide what can wait,
            become smaller, or happen only if something else gives way.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={onTryDemo}>
              Try the overfull day <span aria-hidden="true">→</span>
            </button>
            <button className="button button-secondary" type="button" onClick={onImport}>
              Bring a calendar snapshot
            </button>
          </div>
          <button className="text-action" type="button" onClick={onQuickCheck}>
            Or Quick Check one thing without a calendar
          </button>
        </div>

        <aside className="privacy-card" aria-labelledby="privacy-card-heading">
          <span className="privacy-orbit" aria-hidden="true">LOCAL</span>
          <h2 id="privacy-card-heading">Your calendar stays here.</h2>
          <p>
            Files are read in this tab. No account connection, upload, API,
            model call, analytics, or title guessing.
          </p>
          <ul className="plain-check-list">
            <li>Browser only</li>
            <li>Human-labelled events</li>
            <li>Deterministic explanations</li>
          </ul>
        </aside>
      </section>

      <section className="three-steps section-block" aria-labelledby="three-steps-heading">
        <div>
          <div className="eyebrow">THE LARGER BRAKE</div>
          <h2 id="three-steps-heading">A day has edges. Let us notice them.</h2>
        </div>
        <ol>
          <li>
            <span>01</span>
            <h3>See the shape</h3>
            <p>Import a local snapshot or use the fictional demo day.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Name the constraints</h3>
            <p>You—not an algorithm—mark what is fixed, movable, costly, or recovery.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Make honest room</h3>
            <p>Compare the smallest calendar trade-offs before adding one more thing.</p>
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
