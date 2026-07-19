# Accessibility audit

## Status and limits

This document records a focused accessibility review of the Build Week release
candidate after the Issue #5 visual refinement and the targeted Issue #7
remediation. It covers source inspection, deterministic contrast calculations,
component regression tests, and a Lighthouse check of the initial Home view.

This is **not an accessibility certification or a claim of complete WCAG
conformance**. Automated tools cannot validate whether the full interaction is
understandable with assistive technology, and the dynamic calendar and decision
states were not all exercised by Lighthouse. The manual screen-reader matrix at
the end of this document remains intentionally marked as pending.

## Reviewed surfaces

- Home and its direct Quick Check entry
- all eight Quick Check steps and the verdict
- calendar-file selection and import feedback
- calendar triage and its event-label controls
- Today Map, including overlaps, recovery, gaps, and summary metrics
- Cost of Yes disclosure
- room-making options
- local Decision Journal, including delete and confirmed clear

## Contrast method

Ratios use the WCAG relative-luminance formula and the color tokens in
`src/styles/global.css`. Normal text is evaluated against the 4.5:1 AA
threshold even when it is bold or large. This is deliberately stricter than
relying on the 3:1 large-text exception.

### Core foregrounds and surfaces

| Foreground token | Paper `#f5efe5` | Surface `#faf4e8` | Raised surface `#fffaf0` | Result |
| --- | ---: | ---: | ---: | --- |
| Ink `#151a2d` | 15.080:1 | 15.745:1 | 16.578:1 | AA pass |
| Ink soft `#30364c` | 10.446:1 | 10.906:1 | 11.483:1 | AA pass |
| Muted `#5d6070` | 5.444:1 | 5.684:1 | 5.985:1 | AA pass |
| Cobalt `#1c45c7` | 6.737:1 | 7.034:1 | 7.406:1 | AA pass |
| Cobalt deep `#13349a` | 9.247:1 | 9.655:1 | 10.166:1 | AA pass |
| Coral ink `#87392e` | 6.916:1 | 7.221:1 | 7.603:1 | AA pass |

### Buttons, hover states, badges, and messages

| Foreground / background | Ratio | Current use | Result |
| --- | ---: | --- | --- |
| Raised surface / cobalt | 7.406:1 | primary buttons | AA pass |
| Raised surface / cobalt deep | 10.166:1 | primary-button hover | AA pass |
| Raised surface / coral ink | 7.603:1 | destructive button | AA pass |
| Raised surface / `#713d34` | 8.343:1 | destructive-button hover | AA pass |
| Raised surface / ink | 16.578:1 | toast | AA pass |
| Ink / cobalt soft | 14.358:1 | file-drop hover heading | AA pass |
| Ink soft / cobalt soft | 9.945:1 | choice and label hover | AA pass |
| Muted / cobalt soft | 5.183:1 | file-drop hover support text | AA pass |
| Cobalt / cobalt soft | 6.414:1 | movable chip | AA pass |
| Cobalt deep / cobalt soft | 8.804:1 | proceed badge and selected states | AA pass |
| Coral ink / coral soft | 6.114:1 | postpone and high-energy badges | AA pass |
| Ink soft / coral soft | 9.235:1 | no-plan supporting copy | AA pass |
| Ink / coral soft | 13.332:1 | warning headings | AA pass |
| Ochre ink / ochre | 5.871:1 | reduce badge | AA pass |
| Ink soft / ochre | 9.606:1 | storage warning | AA pass |
| Ink / citron | 12.572:1 | reduce stamp and numbered markers | AA pass |

The lowest text ratio in a current state is 5.183:1, for muted file-drop
support text on the cobalt-soft hover background.

### Small text

The interface uses several deliberately small editorial labels. Each one was
checked as normal text rather than using a large-text exemption.

| Usage | Size | Minimum ratio | Result |
| --- | ---: | ---: | --- |
| Decision stamp | `0.61rem` | 6.114:1 | AA pass |
| Journal metric label | `0.64rem` | 5.985:1 | AA pass |
| Journal verdict badges | `0.65rem` | 5.871:1 | AA pass |
| Chips, plan numbers, all-day label | `0.66rem` | 6.114:1 | AA pass |
| Progress, agenda, and reading labels | `0.68rem` | 5.444:1 | AA pass |
| Eyebrows and metric labels | `0.70rem` | 6.737:1 | AA pass |

### Non-text contrast and intentionally quiet tokens

- `--color-line-strong` measures 4.142:1 on paper, 4.325:1 on surface,
  and 4.554:1 on the raised surface. Required control boundaries therefore
  exceed the 3:1 non-text threshold.
- Cobalt focus and control borders measure at least 6.414:1 against the nearest
  colored surface used by a control.
- `--color-line` measures 1.595:1 to 1.753:1 across the three base surfaces.
  It is used for editorial separators and static card boundaries, not as the
  only boundary of a required control.
- Citron markers measure 1.199:1 on paper and 1.319:1 on the raised surface.
  They are secondary markers; checked or selected states also have native
  state, text, and a cobalt border.
- The paper-deep progress track is approximately 1.2:1 against paper. The
  track is hidden from assistive technology and the visible question count
  communicates the same progress in text.
- Coral on coral-soft measures 2.921:1. Where the pair meets, coral is an
  accent alongside coral-ink borders, error text, `aria-invalid`, or explicit
  warning copy rather than the only state cue.

These lower-contrast decorative tokens must not become the sole indicator of a
control, state, or required information in future changes.

## Semantic and interaction findings

### Home and Quick Check

- The activity field has an explicit label, support or error description,
  `aria-invalid`, and an alert for validation failures.
- Optional calendar actions are exposed as a named group.
- Each scored question uses a native `fieldset`, `legend`, radio group, and
  explicit label. No custom ARIA radio implementation is used.
- The visual progress track is decorative; “Question n of 8” remains text.
- Focus moves to each new question legend and then to the verdict heading.

### Calendar import and candidate setup

- Date and file controls have native labels.
- File errors are associated with the file input through `aria-invalid` and
  `aria-describedby` while retaining the privacy description.
- A dedicated polite, atomic live status announces only the selected-file
  count. The visible file list is not also live, avoiding a duplicate reading.
- The calendar-context candidate field associates its validation alert with
  the input.

### Calendar triage and Today Map

- Every event has a fieldset legend containing its title. Movement choices use
  pressed buttons; the other labels use native checkboxes.
- The triage status includes the selected date in its accessible text and
  announces date or marked-count changes politely.
- Today Map is not a visual-only chart. It includes a definition list of
  metrics, an ordered text agenda, explicit gap durations, event titles and
  times, an “Overlap” chip, “Protected recovery” labels, and an At a glance
  narrative.
- A concise polite, atomic status announces the selected date and four summary
  metrics when the map changes in place.

### Verdict, Cost of Yes, and room-making

- The verdict heading receives focus when the result view mounts.
- Cost of Yes uses `aria-expanded` and `aria-controls`. Its exact search count
  and each answer change are present as text and lists.
- Room-making plans are articles with headings, operation sentences, available
  times, and pressed selection buttons. Color is not the only selected-state
  signal.
- No additional live region was added to these long sections. Human testing
  should determine whether the existing focus and disclosure behavior is clear
  before adding more announcements.

### Decision Journal and dialogs

- Saved decisions use ordered-list, article, heading, time, and definition-list
  semantics. Delete buttons have activity-specific accessible names.
- The count is a polite, atomic live region.
- Deleting an entry moves focus to the next available delete button, or the
  previous one when deleting the last item. Emptying the journal moves focus to
  the empty-state message, with the heading as a fallback.
- The `#journal` fragment target is programmatically focusable but remains out
  of the normal Tab order.
- The clear confirmation is intentionally an inline, labelled `role="group"`,
  not a modal dialog. It does not block the rest of the page and therefore does
  not require a focus trap. Cancelling restores focus to the trigger.

## Automated evidence

### Component regression tests

`src/test/accessibility.test.tsx` verifies:

- the named Home action group;
- candidate and file-input error relationships;
- the single selected-file-count live status;
- date-aware triage and Today Map statuses; and
- focus recovery after journal delete and confirmed clear.

These tests run in JSDOM. They verify DOM state and focus decisions, not spoken
output or a browser accessibility tree.

### Lighthouse

Lighthouse 13.4.0 was run on the local Home view in headless Chrome 150 on
2026-07-19. The accessibility category score was **1.00**, with no failing
applicable audit.

The command shape was:

```sh
npm run dev -- --host 127.0.0.1
npx --yes lighthouse@latest \
  http://127.0.0.1:5173/maybe-tomorrow/ \
  --only-categories=accessibility \
  --output=json \
  --output-path=/tmp/maybe-tomorrow-lighthouse-a11y.json \
  --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --chrome-flags="--headless=new --no-sandbox" \
  --quiet
```

This result applies only to the initially loaded Home state. It does not prove
that the Quick Check, imported-calendar, result, room-making, or populated
journal states are conformant.

### axe CLI attempt

An ephemeral axe-core CLI 4.12.1 run was attempted but did not execute its
audit: its downloaded ChromeDriver supported Chrome 151 while the installed
browser was Chrome 150. This is recorded as a tooling mismatch, **not an axe
pass or failure for the application**. No axe package was added to the project.

For repeatable dynamic-state automation after the submission, a development-
only Playwright and `@axe-core/playwright` suite would provide stronger browser
coverage without adding a runtime application dependency. It is intentionally
not a release blocker.

## Manual validation matrix

All items below are pending human execution. Record the browser, assistive-
technology version, result, and any issue before changing a row to complete.

| Scenario | Keyboard only | macOS VoiceOver | Windows NVDA | iOS VoiceOver | Android TalkBack |
| --- | --- | --- | --- | --- | --- |
| Skip link, primary navigation, and Journal fragment | Pending | Pending | Pending | Pending | Pending |
| Complete all eight Quick Check questions and reach verdict | Pending | Pending | Pending | Pending | Pending |
| Hear validation errors and repair candidate/file inputs | Pending | Pending | Pending | Pending | Pending |
| Label sample events and hear triage count/date updates | Pending | Pending | Pending | Pending | Pending |
| Understand Today Map in linear reading order | Pending | Pending | Pending | Pending | Pending |
| Change the Today Map date and hear the concise update | Pending | Pending | Pending | Pending | Pending |
| Open and read Cost of Yes without duplicate verdict speech | Pending | Pending | Pending | Pending | Pending |
| Understand and select a room-making option | Pending | Pending | Pending | Pending | Pending |
| Save, delete, cancel clear, and confirm clear in Journal | Pending | Pending | Pending | Pending | Pending |
| Verify 360 px reflow, 200% zoom, and no horizontal scroll | Pending | Pending | Pending | Pending | Pending |

Suggested desktop coverage is VoiceOver with Safari and Chrome, and NVDA with
Chrome or Firefox. JAWS must not be named as tested unless a real JAWS session
is run. Mobile checks should include swipe order, native radio and checkbox
gestures, file-chooser handoff, and focus after destructive Journal actions.

— Codex
