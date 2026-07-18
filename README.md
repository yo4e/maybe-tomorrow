# Maybe Tomorrow.

> An anti-productivity tool for people who need help doing one less thing.

Maybe Tomorrow. is a small, browser-only app that helps overproductive people decide whether an activity truly needs to happen today.

Most productivity tools push people forward: do more, keep the streak, finish the list, optimize the day. Maybe Tomorrow. does the opposite. It asks a few simple questions, scores the proposed activity, and gives one of three humane verdicts:

- **Maybe tomorrow.** — postpone it without guilt.
- **Make it smaller.** — keep the intention, reduce the size.
- **Okay. One thing only.** — proceed, then stop adding things.

No account. No runtime AI. No API. No backend. No cloud storage. The app runs entirely in the browser and stores optional decision history in `localStorage`.

## Origin story

Yoshie Yamada works, raises a family, creates fiction, and runs independent projects. In 2025, the year she opened her sole proprietorship, she was taken to the emergency department after trying to carry too much at once. She kept going anyway. Work increased, her music-label activities grew, and there were simply too many interesting things to do. Exactly six months later, she was taken to the emergency department again.

Yoshie did not need another friend saying, “You can do it.” She needed someone willing to say:

> **Does that really have to happen today?**

Maybe Tomorrow. turns postponement into an intentional decision rather than a failure.

## Product principles

1. **Reduce guilt, not ambition.** The app delays an activity; it does not dismiss the user’s interests.
2. **No optimization theatre.** No streaks, points, goals, badges, or productivity dashboards.
3. **One decision in under a minute.** The entire experience should be understandable without instructions.
4. **Private by default.** No data leaves the browser.
5. **Small on purpose.** This hackathon version does one thing well.

## Hackathon scope

The MVP includes:

- a short activity input;
- seven tap-friendly scoring questions;
- deterministic, explainable scoring;
- three verdicts with tailored copy;
- a compact explanation of the strongest factors;
- optional local decision history;
- responsive and accessible design;
- a non-functional “Coming soon” note for calendar and to-do integrations.

The MVP explicitly excludes authentication, accounts, cloud sync, external APIs, Google Calendar, to-do integrations, notifications, localization, and runtime AI.

## Technology

- React
- TypeScript
- Vite
- CSS
- `localStorage`
- Vitest
- GitHub Pages

See [`AGENTS.md`](./AGENTS.md) for implementation instructions and [`docs/PRODUCT_SPEC.md`](./docs/PRODUCT_SPEC.md) for the frozen product specification.

## Collaboration and authorship

**Yoshie Yamada** is the creator and first user of Maybe Tomorrow.

**Templex Tsukino** is Yoshie Yamada’s AI partner, working through ChatGPT with GPT-5.6 Sol. Templex shaped the concept, product logic, UX, and implementation brief.

**Codex** will implement the application from the repository specification. Human-readable work is signed so judges can see which AI partner produced each artifact.

## Status

Specification ready. Implementation pending.

---

— Templex Tsukino