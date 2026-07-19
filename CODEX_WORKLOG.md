# Codex Worklog

Date: 2026-07-18

## Outcome

Implemented the approved Issue #3 expansion from the original Quick Check into
the complete local-first **Maybe Tomorrow. Anti-Planner**.

The enlarged application preserves the deterministic one-activity decision
flow and adds a calendar-aware path that remains browser-only, explainable, and
free of runtime model or external API calls.

## What was built

### Preserved Quick Check

- Kept the seven five-value questions, one shrinkability question, documented
  scoring boundaries, all three guardrails, exactly three verdicts, and factor
  explanations.
- Extracted the flow into a reusable component so standalone and calendar-aware
  decisions share the same scoring engine and result experience.
- Kept keyboard navigation, result focus, back navigation, and activity input
  validation.

### Local calendar snapshot import

- Added browser-local `.ics` file and ZIP archive import using bundled
  `ical.js@2.2.1` and `fflate@0.8.3`.
- Normalized timed events to epoch instants and preserved all-day events as
  exclusive civil-date ranges.
- Implemented ordinary events, `RRULE`, `RDATE`, `EXDATE`, moved recurrence
  exceptions, cancelled instances, UTC, floating time, and embedded
  `VTIMEZONE` behavior.
- Added stable source-and-occurrence IDs that do not depend on event titles.
- Added structured recoverable warnings and bounds for source count, input
  bytes, expanded bytes, components, recurrences, ZIP entries, and emitted
  occurrences.
- Skips unsupported named timezones rather than silently guessing them, and
  rejects sub-daily recurrence frequencies that are inappropriate for this
  planning surface.
- Added a ten-event fictional demo calendar with explicit pre-authored labels.

### Human classification and Today Map

- Added explicit Fixed, Movable, Reducible, High energy, and Recovery labels.
- No code reads a title to assign meaning, scoring weight, or planning
  eligibility.
- Recovery automatically becomes protected and cannot conflict with movable or
  reducible labels.
- Added a chronological semantic agenda with textual event times, openings,
  overlap indicators, all-day treatment, and visible status chips.
- Added union-based occupied time, scheduled time, overlap, longest opening,
  fragmented openings, protected recovery, label counts, and a transparent day
  pressure reading.
- Uses an explicit 7 AM–9 PM planning window so late evening is not quietly
  presented as productivity capacity.

### Replacement Solver

- Added a calendar-mode-only duration question instead of guessing activity
  length from its name or energy answer.
- Computes contiguous openings from interval unions, including overlapping
  events.
- Enumerates compatible combinations of up to three human-authorized changes:
  postponing a Movable event or retaining the first half of a Reducible event.
- Fixed and Recovery events always dominate contradictory labels and are never
  offered as room.
- Plans are stable and ranked by fewest changed events, least changed time,
  earliest opening, and stable event identity.
- Returns up to three Pareto-minimal previews, a no-change result when the
  activity already fits, or a specific bounded no-plan explanation.
- Selecting a plan records only a preview; the imported calendar is never
  mutated.

### Cost of Yes

- Added exhaustive counterfactual search over all `5^7 = 78,125` scored answer
  combinations.
- Reuses the production verdict function, including every guardrail.
- Preserves the shrinkability answer and restricts changes to the semantically
  correct direction for the adjacent verdict.
- Ranks alternatives by fewest changed facts, smallest total answer distance,
  and documented stable factor order.
- Displays changed facts and arithmetic as counterfactual explanation, not a
  recommendation to change the user's answers.

### Decision Journal and privacy

- Replaced the visible v1 history with a validated v2 Decision Journal while
  retaining the v1 parser for migration.
- Migrates valid completed v1 decisions only when v2 is absent and removes v1
  only after a successful v2 write.
- Stores Quick Check entries or compact day-plan entries with frozen metrics,
  candidate duration, and optional selected-plan summary.
- Whitelists every persisted field; original file bytes and complete calendar
  snapshots cannot enter the journal shape.
- Supports review, individual delete, focus-managed confirmed clear-all, a
  50-entry limit, unavailable storage, and malformed-data recovery.
- Added a same-origin Content Security Policy, no-referrer policy, and no
  external application resources.

### Interface and documentation

- Reworked the product narrative around the larger local-first brake while
  preserving Yoshie Yamada's origin story and the direct Quick Check path.
- Added calm paper, botanical, sage, dusk, lavender, and terracotta design
  tokens with dark accessible text, soft cards, restrained motion, and a
  mobile-first vertical timeline.
- Kept native file input and date controls, semantic fieldsets, 44 px targets,
  visible focus, reduced-motion handling, and hostile imported text as JSX text.
- Added `docs/ANTI_PLANNER_SPEC.md` and reconciled README, AGENTS, continuity,
  demonstration, and submission notes with the authorized Issue #3 scope.
- Preserved GitHub Pages test-and-deploy workflow and the production
  `/maybe-tomorrow/` base path.

## Verification

Commands run from the repository root:

```text
npm install --save-exact ical.js@2.2.1 fflate@0.8.3
npm test
npm run build
```

Final automated results:

- Vitest: 7 test files passed, 55 tests passed.
- TypeScript strict project build: passed.
- Vite production build: passed.
- Installed dependency audit: 0 vulnerabilities reported.

The test suite covers:

- scoring boundaries, representative verdicts, and all guardrails;
- complete counterfactual search, direction, ordering, and determinism;
- interval unions, contiguous fit, overlap, protected events, bounded solver
  search, stable ordering, and no-plan reasons;
- local day windows, all-day behavior, classification normalization, and day
  metrics;
- BOM/folded/hostile ICS text, UTC, floating time, embedded zones and DST,
  recurrence rules and exceptions, cancellation, ZIP aggregation, unknown
  zones, input limits, and demo stability; and
- v1 history, v2 journal validation and migration, malformed data, unavailable
  storage, failed migration writes, limits, delete, and clear.

Browser verification covered:

- the complete fictional demo path from pre-labelled triage through Today Map,
  a 60-minute candidate, all eight Quick Check answers, the expected **Maybe
  tomorrow.** verdict, open Cost of Yes arithmetic, a one-change Replacement
  Solver preview, plan selection, and Journal save;
- the expected 30-minute longest opening in the 7 AM–9 PM planning window and a
  solver preview that reduces the labelled gym event to create a contiguous
  60-minute opening;
- the complete 78,125-state counterfactual disclosure and three stable nearest
  alternatives;
- persisted day-plan Journal content after a page refresh, including frozen
  metrics, candidate duration, and selected operation summary;
- native file selection for a real `.ics` fixture through the visible file
  label and successful rendering of its calendar/event data;
- safe plain-text rendering for `<img src=x onerror=alert(1)>` with no image
  element created;
- standalone Quick Check activity submission with Enter after correcting and
  retesting an initially missing explicit key handler;
- 360 × 800 Home, triage, Today Map, candidate, questions, result, solver, and
  Journal surfaces with `scrollWidth === clientWidth === 360` and no element
  outside the viewport;
- 1440 × 900 Home and Today Map layouts; and
- no captured browser console warnings or errors, including CSP violations.

## Deliberate limits and remaining risks

- Imported snapshots are session state and must be imported again after a page
  refresh. Completed journal entries persist locally; full calendar data does
  not.
- ZIP decoding and recurrence expansion are synchronous but strictly bounded.
  A future version could move the same pure core into a module worker without
  changing its domain API.
- Stock `ical.js` has no bundled IANA database. A named timezone without an
  embedded `VTIMEZONE` is reported and skipped rather than misinterpreted.
- The Replacement Solver searches at most 36 eligible operations and three
  event changes. It reports the bound instead of implying completeness beyond
  it.
- A Reduce preview keeps the first half of an event. This is deterministic and
  visible, but not a claim that every real event should be shortened that way.
- All-day events are displayed but not treated as 24 hours of occupied timed
  capacity.
- Offline/PWA installation was not added; the static built app has no external
  runtime dependencies, but first-load offline caching remains future work.
- GitHub Pages is configured but has not been deployed from this uncommitted
  worktree. Repository Pages must use GitHub Actions after the changes reach
  `main`.
- No medical benefit, accessibility certification, or calendar-service
  integration is claimed.

## Issue #5 refinement: Quick Check first

After Templex Tsukino reviewed Yoshie Yamada's feedback in Issue #5, the app
was refined without changing the deterministic engine or privacy boundary.

### Product hierarchy and guidance

- Rebuilt the first viewport around a direct activity field and the primary
  **Check one thing** action. The activity survives a Back navigation from the
  first question and follows the user into optional calendar context.
- Moved calendar import into clearly optional context and kept the fictional
  sample day as a tertiary path. Quick Check remains fully useful without a
  file.
- Added an always-visible explanation of supported `.ics` and Google Calendar
  `.zip` files, followed by a progressive desktop export guide based on the
  official Google Calendar help flow. The interface states that files stay in
  the browser, are not synchronized, and must be imported again to refresh.
- Kept Google sign-in, live synchronization, APIs, authentication, and calendar
  writeback out of this version and out of the product interface.

### Language and visual system

- Replaced implementation-facing labels such as “Solver”, “Counterfactual”,
  internal event grades, and terse classification values with plain control
  copy. The more poetic voice now appears mainly in verdicts and supporting
  explanation.
- Changed Today Map's summary from an opaque grade to observable facts such as
  the longest opening and whether a requested block fits.
- Reworked the visual identity as after-hours stationery / an independent
  magazine: warm paper, midnight ink, cobalt actions and focus, citron markers,
  and sparing coral for postponement, errors, and destructive actions. Cards,
  radii, and shadows were reduced while keyboard focus, forced colors,
  reduced-motion support, and touch targets were preserved.
- Added regression tests for first-screen action order, import guidance,
  factual Today Map language, and removal of technical result terminology.

### Refinement verification

Final commands run from the repository root:

```text
npm test
npm run build
git diff --check
```

- Vitest: 8 test files passed, 60 tests passed.
- TypeScript strict project build and Vite production build: passed.
- Whitespace/error-marker check: passed.
- Browser review: direct Quick Check and Back-state preservation, optional
  import hierarchy, expanded Google Calendar guide, pre-labelled sample triage,
  factual Today Map, and calendar-assisted candidate entry all passed.
- Responsive review: Home and calendar flows had no horizontal overflow at
  360 × 800; the editorial Home composition held at 1440 × 900.
- Browser console: no warnings or errors.

### Refinement handoff

- The changes are intended for the existing `codex/anti-planner-expansion`
  pull request.
- Merge and deployment remain intentionally pending Yoshie Yamada's visual
  review.
- Remaining risk: Google may revise its export navigation, and Workspace
  administrators can restrict export. The app links to official help and does
  not claim mobile export support.
- Rare parser-limit and malformed-calendar warnings retain some precise
  technical vocabulary. Primary controls and normal-path guidance are plain;
  a future copy pass could add a simpler first layer to those diagnostics.

## Final US-English and paper-tone polish

Yoshie Yamada approved one final pass after reviewing the revised application
in the browser. The deterministic product behavior remains unchanged.

- Fixed the remaining grammatical error in the high-energy explanation and
  clarified the middle tomorrow-flexibility sentence.
- Made the commitment and recovery answer scales read in a clear US-English
  order.
- Rendered arbitrary activity input as a quoted phrase in verdict sentences,
  avoiding grammar such as “Start another side project does…”.
- Removed doubled punctuation after quoted verdicts.
- Corrected parallel grammar in calendar-label instructions and polished
  action, metric, import, sample, and journal labels for US English.
- Lightened the paper token from `#f2eadb` to `#f5efe5` to reduce the yellowed
  appearance while preserving midnight ink, cobalt hierarchy, citron markers,
  and sparing coral.
- Added focused result-copy regression coverage for all three verdicts and the
  quoted-verdict punctuation boundary.

Final verification after this pass:

- Vitest: 9 test files passed, 64 tests passed.
- TypeScript strict project build and Vite production build: passed.
- `git diff --check`: passed.
- Browser review: softened paper color, import guidance, all eight Quick Check
  answers, quoted result sentence, corrected factor sentence, quoted-verdict
  punctuation, sample triage, and factual Today Map labels all passed.
- The 360 px result and Today Map remained free of horizontal overflow; no
  journal entry was added or removed during verification.

## Build Week submission package and release audit

Issue #6 authorized the final submission-preparation pass. The application
behavior and privacy boundary remain unchanged; this pass makes the repository
reviewable, recordable, and safer to submit.

### Submission and licensing

- Added an MIT `LICENSE` for Yoshie Yamada's original work, as authorized in
  Issue #6, plus `THIRD_PARTY_NOTICES.md` and exact bundled license texts for
  React, Scheduler, Vite, Rolldown, `ical.js`, `fflate`, and the modulepreload
  polyfill.
- Re-audited the current official Build Week page, Devpost overview, rules,
  FAQ, deadline, video requirements, public-repository requirement, and
  `/feedback` requirement. Account-only eligibility answers and final Devpost
  submission remain human decisions.
- Rebuilt `submission/` into a paste-ready handoff: a 283-word narration,
  24-cue captions ending at 2:30, exact answer keys, shot list, recording and
  reset runbooks, YouTube metadata, Devpost copy, manual-action checklist, and
  a final QA checklist.
- Added a deterministic submission verifier for required files, relative
  Markdown links, narration/caption agreement, caption duration, PNG
  dimensions, and the three intentionally unresolved public placeholders.

### Visual assets and browser identity

- Added an original cobalt, cream, and citron favicon in SVG plus a 180 × 180
  Apple touch icon.
- Added eight fictional-data screenshots covering desktop and 390 px mobile
  flows, original Devpost and YouTube thumbnail sources and PNG exports, and a
  local storyboard for reviewing the complete asset set.
- No personal calendar, account, session ID, or private Build Week data appears
  in the public assets.

## Issue #7 accessibility follow-up

Copilot's Issue #7 proposal was useful, but a repository change cannot honestly
certify all assistive-technology behavior. The response therefore combines
targeted remediation, reproducible evidence, and an explicit manual matrix.

- Grouped the Home context choices semantically; associated candidate and file
  errors with their fields using `aria-invalid` and `aria-describedby`; and
  added polite status announcements for imported-file count, triage date, and
  Today Map metrics.
- Added predictable focus recovery after deleting or clearing journal entries
  and made the journal fragment target programmatically focusable.
- Added seven accessibility regression tests and a signed audit documenting
  semantic review, keyboard and reflow checks, exact contrast measurements,
  automated results, limitations, and pending VoiceOver/NVDA/iOS/TalkBack
  checks.
- The lowest measured current text contrast is 5.183:1, and a Home-page
  Lighthouse accessibility audit scored 1.00. An attempted axe run was not
  counted because the available ChromeDriver and Chrome major versions did not
  match. No WCAG or screen-reader certification is claimed.

### Final verification for this branch

Commands run from a clean dependency install:

```text
npm ci
npm test
npm run build
npm run verify:submission
git diff --check
```

- npm reported 94 installed packages and zero known vulnerabilities.
- Vitest: 10 test files passed, 71 tests passed.
- TypeScript strict checking and Vite production build: passed.
- Submission verifier: 37 required files, 108 relative Markdown links across
  28 files, exact narration/caption agreement, 24 caption cues ending at 2:30,
  ten validated PNG assets, and only the approved placeholders passed.
- Mobile browser review at 390 × 844 found no horizontal overflow. The Home,
  sample triage, Today Map, and calendar-assisted Quick Check routes rendered;
  live status text and candidate-error relationships were present; both icon
  links resolved under the Vite base path; and the browser console contained no
  warnings or errors.
- The existing local journal entry was not modified during browser review.

### Remaining human-only work and risks

- Yoshie Yamada and Templex Tsukino must review this branch before merge.
- A human should run the short VoiceOver spot-check in the accessibility audit;
  broader platform screen-reader validation remains desirable but is not a
  blocker falsely represented as complete.
- Yoshie must record and edit the English-voiceover demo, upload it publicly to
  YouTube, verify signed-out playback, run `/feedback` in the primary Build Week
  task without committing its Session ID, complete the account-only Devpost
  fields, replace the three placeholders, and submit.
- The bundled MPL-2.0 license and source link for `ical.js` are provided as a
  conservative compliance measure, not legal advice.

## Pull Request #8 review corrections

Templex Tsukino identified two narrow release blockers before merge, and both
were addressed without changing application behavior.

- Removed avoidable third-party names from the locked video narration and
  captions: `calendar export ZIP` replaces the service-specific phrase, and
  `browser app` replaces the framework-specific phrase. The 283-word count and
  2:30 caption timeline remain unchanged.
- Restricted collaboration-evidence capture to signed local Markdown, local
  `git log --oneline` output, and the local worklog. The canonical script,
  shot list, runbook, and QA checklist now prohibit hosting-service pages,
  third-party logos, remote URLs, branded window chrome, and account UI.
- Added a submission-verifier guard that rejects the avoidable video phrases,
  requires the neutral replacements, compares the canonical narration and all
  shot-list narration with the teleprompter, and checks all three capture
  instructions for local-only evidence.
- Reworded the `ical.js` distribution notice using MPL-2.0 terminology: the
  bundled asset is identified as Executable Form and the exact-version,
  unmodified Source Code Form remains linked alongside the full license text.
  The production HTML notice uses the same terminology.

— Codex
