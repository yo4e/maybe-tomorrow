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

- At this audit stage, Yoshie Yamada and Templex Tsukino still needed to review
  the branch before merge; that review was completed during the final video
  production pass recorded below.
- A human should run the short VoiceOver spot-check in the accessibility audit;
  broader platform screen-reader validation remains desirable but is not a
  blocker falsely represented as complete.
- At this audit stage, Yoshie still needed to record and approve the demo,
  upload it publicly to YouTube, verify signed-out playback, run `/feedback` in
  the primary Build Week task without committing its Session ID, complete the
  account-only Devpost fields, replace the three placeholders, and submit.
  Subsequent video-production work is recorded below.
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

## Post-merge timezone hotfix

After Pull Request #8 was approved and merged, the Pages workflow exposed a
timezone-dependent sample-day test. The fixed `Asia/Tokyo` instants in the
fictional calendar were being compared with browser-local planning windows.
That produced the intended 30-minute longest opening in Japan, but a 9-hour
opening in the workflow's UTC environment—and would also shift the fictional
demo for overseas judges.

- Changed only the bundled fictional sample to RFC 5545 floating times, so its
  7:30 AM–9:00 PM story stays identical in each viewer's local timezone.
- Preserved real timezone semantics for every user-imported calendar.
- Updated the demo regression to create a local one-day window and verify that
  the first event remains at 7:30 AM local time.
- Corrected `createLocalCalendarWindow`'s TypeScript parameter annotation from
  an accidentally inferred literal `7` to the implemented `number` range.
- Re-ran all 71 tests under `Asia/Tokyo`, `UTC`, and
  `America/Los_Angeles`, then reran the strict build, submission verifier, and
  whitespace check.

## Personal-story demo revision

After the application and submission package shipped, Yoshie supplied private
working media from a hospital stay, an internet cafe, a gym, and a local summer
festival. The production plan now uses a few brief, sanitized excerpts to make
the lived problem and the human–AI build process concrete without displacing
the product demo.

- Rechecked the current official Devpost video requirements: the demo remains
  under three minutes, includes audible GPT-5.6 and Codex use, and excludes
  unlicensed third-party marks, music, and other protected material.
- Preserved the exact 283-word narration count and 2:30 runtime while adding
  the personal origin line, the real remote-build locations, and the festival
  payoff: protected time outside the build is the point of the product.
- Refined the final English copy so the verdict explanation distinguishes
  hypothetical alternatives from unchanged original answers, calendar context
  refers precisely to event times, and the festival line claims only scoped
  release work rather than completion of the whole application.
- Aligned the opening edit with its narration: Yoshie's hospital portrait is
  followed by the hospital-room still before the product home screen appears.
- Synchronized the canonical script, teleprompter, shot list, and 27-cue SRT.
  The verifier confirms exact normalized narration agreement across them.
- Limited Yoshie's new recording burden to two silent horizontal B-roll takes:
  a short introduction and a finished-product review. She does not need to
  perform English on camera.
- Added explicit sanitization rules for hospital, internet-cafe, gym, and
  festival media: work from copies; remove marks, book covers, private screens,
  labels, QR codes, and unapproved likenesses; mute all source audio; and make
  no medical claim.
- Allowed either Yoshie's recorded English or a properly licensed synthetic
  English voice under her direction and approval. The runbook, YouTube
  metadata, manual steps, and QA checklist now require truthful disclosure if
  the final narration is synthetic.
- Kept all raw media local and excluded it from Git tracking through the local
  repository exclude file. No personal image or video was added to the public
  branch.
- Created a separate Japanese meaning and filming guide on Yoshie's desktop;
  the tracked repository remains English-only.

Verification after the revision:

```text
npm test -- --run
npm run build
npm run verify:submission
git diff --check
```

- Vitest: 10 test files and all 71 tests passed.
- Production build: strict TypeScript and Vite build passed.
- Submission verifier: 37 required files, 110 relative Markdown targets,
  exact 283-word narration/caption agreement, 27 cues ending at 2:30, video
  trademark/synchronization guardrails, ten PNG dimensions, and placeholder
  policy all passed.
- At this stage, remaining human work included recording two silent B-roll
  takes, approving public use and sanitization of the personal footage,
  approving the English voice and edit, uploading publicly, completing
  `/feedback`, and submitting the account-only Devpost fields. The B-roll and
  visual approvals were completed during the production pass below.

— Codex

## Final demo assembly and narration license audit

Yoshie then supplied the two silent horizontal B-roll clips and authorized an
original song she owns, written by Templex Tsukino and released through KazeX
Records. Codex assembled 2:30 candidate edits with matching English and
Japanese caption timelines; after review, the English edition became the only
submission master and the Japanese SRT/edition was deferred as optional
post-submission work.

- Opened with ten seconds of Yoshie's computer footage and the original song,
  then ducked the music deeply below the English narration.
- Added the exact on-screen credit `Music: Templex Tsukino / KazeX Records`
  and retained the `AI-generated persona` disclosure for Templex's visual.
- Used Yoshie's hospital, internet-cafe, gym, and festival material only in
  sanitized derivatives. Private screens, book covers, signs, and unrelated
  people are obscured; source audio is not used.
- Kept the app interface and English narration timing identical between the
  candidate editions. Only the burned-in caption language changed. A verifier
  assertion requires all 27 Japanese cues to match the English cue numbers and
  timings exactly, so the optional edition can be produced later without
  altering the submission cut.
- Rejected the first browser-recorded render during frame QA after intermittent
  damaged frames and a short preroll were found. Replaced real-time screen
  recording with deterministic rendering of exactly 4,500 fixed-time frames
  per edition, then repeated the visual and technical audits.
- Stripped GPS, device, recording-date, cover-art, lyric, author, and source-
  tool metadata from the MP4 candidates. Raw personal media and video binaries
  remain in the ignored local media workspace; only the production
  documentation and caption files enter the public repository.
- Revised the requested visual details: removed excessive blurring, replaced
  it with deliberate crops, moved the festival excerpt to the later
  stall-filled portion, and added an unambiguous fade to black. Yoshie approved
  the complete visual edit, personal-media crops, and music treatment, and
  separately confirmed that the selected festival segment contains no
  disallowed trademark logo.
- Audited the synthetic-narration rights before publication. The candidate
  using the macOS Samantha System Voice was rejected before upload; no public
  distribution relies on that voice.
- Replaced the rejected narration with Kokoro-82M's `af_heart` voice. Yoshie
  approved the voice sample before the complete render. The model page
  identifies Apache-2.0; the downloaded model revision is
  `f3ff3571791e39611d31c381e3a41a3af07b4987`, and the local production
  environment uses `kokoro` 0.9.4 and `misaki` 0.9.4. The model and packages
  are production tools only and are not shipped in the app or browser bundle.
  A conservative public credit is recorded in `THIRD_PARTY_NOTICES.md`.

Superseded candidate and rights-cleared master verification:

- The rejected System Voice candidates were exactly `150.000` seconds,
  `1920 × 1080`, constant `30 fps`, 4,500 H.264 frames, and AAC-LC stereo at
  `48 kHz`; frame checks, caption timings, privacy treatments, music credit,
  and AI-persona disclosure passed for those files.
- Those passes are retained only as production history. The rights-cleared
  master was remuxed from the approved visual stream rather than re-encoding
  it; extracted H.264 hashes match exactly at
  `3b4054393f9c5875d7674c13d502f9cba0f2339270dc2f363644c3ca140de6ec`.
- The new master is exactly `150.000` seconds with `1920 × 1080` H.264 video,
  4,500 frames at constant `30 fps`, BT.709 tags, and AAC stereo at `48 kHz`.
- The final mix measures `-17.29 LUFS-I`; AAC-decoded audio measures
  `-1.42 dBTP` at 4x oversampling and contains no clipped samples. Narration is
  silent through `0:10`, and each of the seven paragraphs ends at least one
  second before its allocated boundary.
- The MP4 exposes only ordinary container and stream-handler tags. It contains
  no location, device, author, recording date, artwork, lyric, or source-tool
  metadata. Its SHA-256 is
  `8b57a622f018422852589d13cb673e377685d122d58c716b4ea0bb2e0f6d2332`.
- Exact generated text preserves the locked narration; phonetic source hints
  are limited to names and initialisms. Yoshie watched and listened to the
  complete master on July 20, 2026 and approved pronunciation, clarity, pacing,
  music balance, caption synchronization, and the final visual/rights pass.
- Templex reviewed Pull Request #10 and reported no remaining
  repository-visible blocker, subject only to Yoshie's full-playback approval;
  Yoshie's approval completed that release gate.
- `npm test -- --run`: 10 files and all 71 tests passed.
- `npm run build`, `npm run verify:submission`, and `git diff --check` passed.

The English-only replacement is now the technically verified and human-approved
submission master, but it is not yet publicly released. Remaining work is the
public YouTube upload and signed-out playback check, `/feedback`, and the
account-only Devpost submission steps. A Japanese-captioned companion may be
produced after submission if time and credits remain.

## Pull Request #10 merge and public release verification — July 20, 2026

- Pull Request #10 was marked ready only after Templex's review and Yoshie's
  complete-video approval, then merged to `main` as `d42c36a`.
- GitHub Actions run `29708164385` completed both the build and GitHub Pages
  deployment jobs successfully. The deployed home and `favicon.svg` each
  returned HTTP 200.
- A clean public-browser Quick Check reproduced **Maybe tomorrow.**, its three
  expected leading factors, and the complete `78,125`-combination Cost of Yes
  result.
- The fictional sample reproduced `11 hr 30 min` occupied, a `30 min` longest
  opening, `0 min` overlap, and `1 hr 15 min` protected recovery. Its
  room-making path shortened **Go to the gym** by `30 min`, left `5:00–6:00
  PM` open, and reported `18` allowed combinations.
- At `360 × 800`, the document width remained exactly `360 px`; no horizontal
  overflow appeared. The English document language, page title, favicon,
  primary home content, and navigation were present, with no browser warning
  or error logged.
- Remaining submission work is deliberately account-bound: public YouTube
  upload and signed-out playback, `/feedback`, and the Devpost form. The
  optional VoiceOver spot-check remains explicitly unclaimed rather than being
  represented as certification.

— Codex

## Public submission completion and repository cleanup — July 20, 2026

Yoshie completed every account-bound release step and submitted **Maybe
Tomorrow.** to OpenAI Build Week in the **Apps for Your Life** category.

- Published the approved 2:30 English master at
  <https://www.youtube.com/watch?v=l8Zu30-sUvQ>, confirmed YouTube Studio
  visibility was **Public**, and verified signed-out playback.
- Completed `/feedback` in the primary Codex build task and pasted the Session
  ID only into Devpost. The private value is deliberately absent from the
  repository, issues, pull requests, and public descriptions.
- Completed and previewed every required Devpost field, then submitted the
  public entry at
  <https://devpost.com/software/maybe-tomorrow-6oau91>.
- Checked the public Devpost profile and project page while signed out. The
  project name, tagline, story, Build With tags, ten-item media carousel,
  embedded video, captions, Created By statement, live-app link, and repository
  link were present.
- Recorded the decision not to produce a separate Japanese-captioned video for
  this release. The timing-matched Japanese SRT remains an archival production
  artifact; the English master is canonical.
- Replaced public URL placeholders throughout the submission archive and kept
  only the private `/feedback` Session ID placeholder in designated files.
  Updated the submission verifier to enforce that smaller boundary.
- Audited the complete Git history and current index for audiovisual media. No
  MP4, MOV, WebM, MP3, WAV, AAC, CAF, M4A, personal photo, source audio,
  soundtrack source, narration output, or rendered video master is tracked or
  has appeared in repository history. Added `/動画素材/` to the committed
  `.gitignore` so future clones preserve the same boundary that had previously
  existed only in the local repository exclude file.
- Kept the root MIT license unchanged because the finished video and private
  production media are not distributed in the repository. Public fictional
  screenshots, original thumbnail artwork, captions, scripts, and production
  documentation remain repository artifacts.
- Added a repository-only post-hackathon roadmap covering an installable PWA
  path and a separately specified, opt-in, read-only calendar connection. Both
  are possible directions rather than promises; Quick Check, deterministic
  explanations, local snapshot import, and the current privacy model remain
  release gates.
- Audited the public YouTube metadata directly. The published title matches the
  prepared metadata, the description is clean, and Yoshie added the final
  Devpost cross-link. The completed description was verified while signed out.

Public release map:

- app: <https://yo4e.github.io/maybe-tomorrow/>;
- repository: <https://github.com/yo4e/maybe-tomorrow>;
- demo: <https://www.youtube.com/watch?v=l8Zu30-sUvQ>;
- Devpost: <https://devpost.com/software/maybe-tomorrow-6oau91>; and
- hackathon: <https://openai.devpost.com/>.

The optional screen-reader platform matrix remains explicitly **Pending** and
no accessibility certification is claimed.

Cleanup verification:

- `npm test -- --run`: 10 files and all 71 tests passed.
- `npm run build`: TypeScript and the Vite production build passed.
- `npm run verify:submission`: all manifest, link, video guardrail, caption,
  asset, and placeholder checks passed.
- `git diff --check`: passed.
- The live app, Devpost entry, public YouTube page, hackathon page, and public
  repository each returned HTTP 200.

— Codex
