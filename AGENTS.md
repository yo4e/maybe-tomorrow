# AGENTS.md

## Mission

Implement the complete hackathon MVP of **Maybe Tomorrow.** in one coherent pass.

Maybe Tomorrow. is an English-only, browser-only anti-productivity app. It helps overproductive people decide whether a proposed activity should happen today, be reduced, or be postponed.

Read these files before writing code:

1. `README.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/SCORING.md`
4. `docs/UX_COPY.md`
5. `docs/DESIGN_SYSTEM.md`
6. `docs/IMPLEMENTATION_PLAN.md`

If documents appear to conflict, use this precedence:

1. `AGENTS.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/SCORING.md`
4. other documents

## Required stack

- React
- TypeScript with strict mode
- Vite
- plain CSS or CSS Modules; do not add a component library
- Vitest for scoring tests
- npm
- GitHub Pages deployment workflow

## Non-negotiable constraints

- English only.
- No runtime AI or model calls.
- No external API calls.
- No backend or server.
- No authentication or accounts.
- No analytics or tracking.
- No calendar or to-do integration in this version.
- No notification permission.
- No localization framework.
- No gamification: no streaks, achievements, points, levels, or productivity metrics.
- Do not add features merely because they are easy.
- Keep the app useful offline after its first load if practical, but do not turn PWA work into a blocker.

## Core implementation outcome

A user must be able to:

1. enter an activity they are considering;
2. answer seven quick questions;
3. receive one of exactly three verdicts;
4. understand why the verdict was produced;
5. save the result locally;
6. review or delete local history;
7. restart immediately with another activity.

## Quality bar

- Mobile-first and comfortable at 360 px width.
- Works with mouse, touch, and keyboard.
- Visible focus states.
- Semantic HTML and accessible labels.
- Respect `prefers-reduced-motion`.
- No horizontal scrolling.
- No console errors.
- Deterministic scoring with unit tests covering boundaries and representative scenarios.
- `npm run build` must succeed.
- The repository must be deployable to GitHub Pages.

## Architecture guidance

Prefer a small structure such as:

```text
src/
  app/
  components/
  domain/
    scoring.ts
    types.ts
  storage/
    history.ts
  styles/
  test/
```

The scoring engine must be a pure function with no UI dependencies. Store only completed decisions in `localStorage`. Validate parsed storage data and recover safely from malformed values.

## Scope discipline

The “Coming soon” section may mention:

- Google Calendar
- to-do list integrations
- automatic suggestions about what to postpone

It must be clearly non-interactive and must not imply that these integrations already exist.

Do not implement the following:

- weather lookup;
- medical symptom assessment;
- health recommendations;
- task imports;
- user profiles;
- social sharing;
- AI-generated explanations;
- configurable scoring weights;
- dark mode unless the base implementation is already complete and stable.

## Authorship policy

The project intentionally makes AI collaboration visible to hackathon judges.

- Existing specification documents are signed `— Templex Tsukino`.
- Any Markdown document, issue body, PR description, release note, or substantial issue comment authored by Codex must end with `— Codex`.
- Codex-created commits should include `Codex` in the commit message.
- Do not add noisy authorship headers to every source-code file. Instead, record implementation decisions in `CODEX_WORKLOG.md`, signed `— Codex`.
- Do not remove or replace Templex Tsukino’s signatures.

## Completion report

At the end of implementation:

1. create or update `CODEX_WORKLOG.md` with what was built, tests run, compromises, and remaining risks;
2. update the README status from “Implementation pending” to an accurate state;
3. include exact local run commands;
4. report the deployed GitHub Pages URL if deployment is available;
5. identify any acceptance criterion that remains incomplete instead of hiding it.

---

— Templex Tsukino