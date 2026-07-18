# Maybe Tomorrow.

> A local-first anti-planner for people who need help doing one less thing.

Maybe Tomorrow. starts with one ordinary question: does this really have to
happen today? A user can check one proposed activity immediately, with no
calendar required. Optional local calendar context can make the same decision
more grounded. The app returns exactly three humane verdicts:

- **Maybe tomorrow.** — postpone it without guilt;
- **Make it smaller.** — keep the intention and reduce the size; or
- **Okay. One thing only.** — proceed, then stop adding things.

The app has no account, backend, analytics, external API, calendar connection,
or runtime AI. A calendar snapshot can be deliberately imported from an `.ics`
file or a ZIP export, but every byte is parsed in the current browser tab.

## What makes it an anti-planner

Most productivity tools help users fit more into a day. Maybe Tomorrow. asks a
different question: if this new activity happens, what gives way?

The expanded Build Week version connects five explainable tools:

1. **Quick Check** — seven scored questions plus one reduction question;
2. **Today Map** — a chronological view of occupied time, openings, overlaps,
   and protected recovery;
3. **Human classification** — only the user may label events Fixed, Movable,
   Reducible, High energy, or Recovery;
4. **Replacement Solver** — searches bounded combinations of allowed changes
   and proposes the smallest calendar trade-offs that create a contiguous
   opening; and
5. **Cost of Yes** — exhaustively searches all 78,125 answer combinations to
   show the nearest facts that would have produced another verdict.

The solver previews possibilities. It never edits a calendar, infers meaning
from an event title, or calls a model to generate advice.

## Origin story

Yoshie Yamada works, raises a family, creates fiction, and runs independent
projects. In 2025, the year she opened her sole proprietorship, she was taken to
the emergency department after trying to carry too much at once. She kept going
anyway. Work increased, her music-label activities grew, and there were simply
too many interesting things to do. Exactly six months later, she was taken to
the emergency department again.

Yoshie did not need another friend saying, “You can do it.” She needed someone
willing to say:

> **Does that really have to happen today?**

Maybe Tomorrow. turns postponement into an intentional decision rather than a
failure. It does not claim to provide medical advice or prevent illness.

## Privacy model

- Imported files are read in the current tab and are not uploaded.
- The original calendar file and full snapshot are not stored in the journal.
- Only completed decisions, compact day metrics, and a chosen plan summary may
  be saved to `localStorage`.
- Event titles are display text only; classification and planning eligibility
  come from explicit human labels.
- A restrictive Content Security Policy permits only same-origin application
  resources and blocks third-party runtime connections.

## Supported calendar input

- individual `.ics` files;
- ZIP archives containing one or more `.ics` files, including ordinary Google
  Calendar export structure; and
- the bundled fictional “Yoshie’s overfull Tuesday” demo.

For Google Calendar, use a computer and choose **Settings → Import & export →
Export**, then select the downloaded ZIP in Maybe Tomorrow. without unpacking
it. Google’s mobile Calendar app does not provide export, and an organization
administrator may restrict it. See [Google Calendar’s export
instructions](https://support.google.com/calendar/answer/37111?hl=en).

The parser supports timed and all-day events, `RRULE`, `RDATE`, `EXDATE`, moved
or cancelled recurrence exceptions, UTC, floating time, and embedded
`VTIMEZONE` definitions. Imports are bounded by file, expanded size, component,
recurrence, and occurrence limits. Unknown named timezones without an embedded
definition are skipped rather than guessed.

## Technology

- React 19
- TypeScript in strict mode
- Vite
- plain CSS
- Vitest
- [`ical.js`](https://github.com/kewisch/ical.js) for RFC 5545 parsing
- [`fflate`](https://github.com/101arrowz/fflate) for bundled ZIP decoding
- browser `localStorage`
- GitHub Pages

## Documentation map

- [`AGENTS.md`](./AGENTS.md) — implementation constraints and approved Issue #3 override
- [`docs/ANTI_PLANNER_SPEC.md`](./docs/ANTI_PLANNER_SPEC.md) — current expansion specification
- [`docs/PRODUCT_SPEC.md`](./docs/PRODUCT_SPEC.md) — original Quick Check product behavior
- [`docs/SCORING.md`](./docs/SCORING.md) — deterministic verdict formula and guardrails
- [`docs/UX_COPY.md`](./docs/UX_COPY.md) — original verdict copy
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — original visual foundation
- [`docs/DEMO_SCENARIOS.md`](./docs/DEMO_SCENARIOS.md) — reproducible Quick Check and anti-planner demos
- [`CODEX_WORKLOG.md`](./CODEX_WORKLOG.md) — implementation record and verification
- [Issue #3](../../issues/3) — expansion proposal, review, and authorization
- [Issue #5](../../issues/5) — Quick Check hierarchy and editorial-identity refinement

## Run locally

Requirements: Node.js 22.12 or newer and npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. Because the production base path is
`/maybe-tomorrow/`, the usual development URL is:

```text
http://localhost:5173/maybe-tomorrow/
```

## Verify and preview production

```bash
npm test
npm run build
npm run preview
```

The production files are written to `dist/`.

## Demo paths

### Core decision first

1. Enter `Start another side project` in the first viewport.
2. Select **Check one thing** and complete the eight quick answers.
3. Pause on **Maybe tomorrow.** and open **What would need to change?**
4. Save the result to the local journal.

### Optional deeper calendar context

1. Return home and select **Try the sample day**.
2. Review or change the fictional human labels, then open the Today Map.
3. Select **Check one thing**, name an activity, and choose its honest duration.
4. Complete Quick Check, compare **See what would have to move**, and save an
   optional room-making choice.

## Status

The expanded anti-planner and approved Issue #5 refinement are implemented on
the review branch. The deterministic test suite covers scoring,
counterfactuals, replacement planning, day metrics, ICS/ZIP import, recurrence
and timezone behavior, journal migration, malformed storage recovery, and the
refined first-screen hierarchy. GitHub Pages deployment is configured, but the
refinement remains pending Yoshie Yamada’s browser review and must not be
merged or deployed before that review.

Expected public URL after deployment:

> `https://yo4e.github.io/maybe-tomorrow/`

## Collaboration and authorship

**Yoshie Yamada** is the creator and first user of Maybe Tomorrow.

**Templex Tsukino**, Yoshie’s AI partner working through ChatGPT with GPT-5.6
Sol, shaped the concept, product logic, original specification, and Issue #3
review.

**Codex** implemented, tested, and documented the browser application. Signed
artifacts intentionally make this human–AI–AI collaboration visible to Build
Week judges.

Original product specification:

— Templex Tsukino

Current implementation status and expansion documentation:

— Codex
