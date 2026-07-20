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

## OpenAI Build Week entry

Maybe Tomorrow. was submitted to [OpenAI Build
Week](https://openai.devpost.com/) in the **Apps for Your Life** category on
July 20, 2026.

- [Try the live application](https://yo4e.github.io/maybe-tomorrow/)
- [View the Devpost entry](https://devpost.com/software/maybe-tomorrow-6oau91)
- [Watch the 2:30 demo](https://www.youtube.com/watch?v=l8Zu30-sUvQ)
- [Browse the public repository](https://github.com/yo4e/maybe-tomorrow)

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

- [`submission/README.md`](./submission/README.md) — canonical OpenAI Build Week submission kit and final checklist
- [`submission/DEMO_VIDEO_SCRIPT.md`](./submission/DEMO_VIDEO_SCRIPT.md) — complete under-three-minute demo narration and shot list
- [`submission/video/README.md`](./submission/video/README.md) — recording runbook, shot list, captions, metadata, final Devpost copy, and human-only steps
- [`submission/assets/ASSET_MANIFEST.md`](./submission/assets/ASSET_MANIFEST.md) — fictional-data screenshots and original thumbnail assets
- [`submission/DEVPOST_SUBMISSION.md`](./submission/DEVPOST_SUBMISSION.md) — audited Devpost field summary and route to the final paste-ready copy
- [`submission/COLLABORATION_STORY.md`](./submission/COLLABORATION_STORY.md) — documented human–AI–AI build workflow
- [`AGENTS.md`](./AGENTS.md) — implementation constraints and approved Issue #3 override
- [`docs/ANTI_PLANNER_SPEC.md`](./docs/ANTI_PLANNER_SPEC.md) — current expansion specification
- [`docs/PRODUCT_SPEC.md`](./docs/PRODUCT_SPEC.md) — original Quick Check product behavior
- [`docs/SCORING.md`](./docs/SCORING.md) — deterministic verdict formula and guardrails
- [`docs/UX_COPY.md`](./docs/UX_COPY.md) — original verdict copy
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md) — original visual foundation
- [`docs/DEMO_SCENARIOS.md`](./docs/DEMO_SCENARIOS.md) — reproducible Quick Check and anti-planner demos
- [`docs/ACCESSIBILITY_AUDIT.md`](./docs/ACCESSIBILITY_AUDIT.md) — measured contrast, semantic review, automated evidence, and pending human screen-reader matrix
- [`docs/POST_HACKATHON_ROADMAP.md`](./docs/POST_HACKATHON_ROADMAP.md) — possible directions after the submitted Build Week release
- [`CODEX_WORKLOG.md`](./CODEX_WORKLOG.md) — implementation record and verification
- [Issue #3](../../issues/3) — expansion proposal, Templex review, and authorization
- [Issue #5](../../issues/5) — Yoshie feedback, Quick Check hierarchy, and editorial-identity refinement
- [Pull Request #4](../../pull/4) — reviewed and merged Anti-Planner implementation

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
npm run verify:submission
npm run preview
```

The production files are written to `dist/`.

## License

Maybe Tomorrow.'s original project code and documentation are licensed under
the [MIT License](./LICENSE), Copyright (c) 2026 Yoshie Yamada. Third-party
components remain under their respective licenses and are not relicensed under
MIT; exact versions, sources, and included license texts are recorded in
[`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

The finished demo video, personal footage, raw audio, soundtrack sources,
narration outputs, and other local production files are not distributed in
this repository and are outside the repository license. The local
`動画素材/` production workspace is explicitly ignored by Git.

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

The approved local-first Anti-Planner, Issue #5 hierarchy refinement, final
US-English copy pass, and paper-tone polish are merged into `main`, deployed,
and submitted to OpenAI Build Week.

Public release:

- Application: <https://yo4e.github.io/maybe-tomorrow/>
- Devpost: <https://devpost.com/software/maybe-tomorrow-6oau91>
- Demo video: <https://www.youtube.com/watch?v=l8Zu30-sUvQ>
- Hackathon: <https://openai.devpost.com/>

Final recorded verification:

- Vitest: 10 test files and 71 tests passed;
- TypeScript strict build and Vite production build passed;
- `git diff --check` passed;
- 360 px and desktop browser review passed without horizontal overflow; and
- no browser console warnings or errors were observed.

## OpenAI Build Week collaboration

The live application intentionally uses no runtime AI. GPT-5.6 and Codex were
instead essential to how the product was conceived, governed, implemented, and
reviewed.

**Yoshie Yamada** is the creator and first user. She is a novelist and freelance
writer, not a software engineer, and did not manually write or edit the
application code. She supplied the lived problem, made product and trust
decisions, directed part of the build from a smartphone while away from her
computer, tested the working browser experience, identified failures in
hierarchy, English, and visual identity, and gave final approval.

**Templex Tsukino**, Yoshie’s long-term AI partner working through ChatGPT with
GPT-5.6 Sol, transformed their conversations into signed product specifications,
deterministic scoring rules, complete UX copy, design direction, privacy
boundaries, implementation briefs, demo scenarios, and review gates. Templex
reviewed Codex’s larger Anti-Planner proposal in Issue #3 and Yoshie’s product
feedback in Issue #5.

**Codex** implemented, tested, documented, refined, and deployed the React and
TypeScript application. It exposed proposals, work reports, commits, and a pull
request so that Templex could review implementation remotely and Yoshie could
accept or reject the working product.

The repository was the collaboration protocol: conversation became signed
specifications; disagreements became issues; authority became review gates;
implementation became commits and Pull Request #4; quality became reproducible
tests and demo paths; and acceptance remained a human decision made by using
the product.

The full evidence map and narrative are in
[`submission/COLLABORATION_STORY.md`](./submission/COLLABORATION_STORY.md).

## Collaboration and authorship

**Yoshie Yamada** is the creator, product authority, and first user of Maybe
Tomorrow.

**Templex Tsukino**, working through ChatGPT with GPT-5.6 Sol, shaped the concept,
product logic, specifications, copy, design decisions, and review process.

**Codex** implemented, tested, documented, refined, and deployed the browser
application.

Signed artifacts intentionally make this human–AI–AI collaboration visible to
Build Week judges.

Original product specification:

— Templex Tsukino

Current implementation status and expansion documentation:

— Codex
