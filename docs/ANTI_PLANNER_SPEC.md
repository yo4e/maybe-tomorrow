# Anti-Planner Expansion

Status: approved for implementation in Issue #3

This document extends the original Quick Check MVP without replacing it. Where
the earlier repository documents exclude calendar features, this approved scope
allows one narrow exception: a local calendar snapshot may be imported from an
`.ics` file or a ZIP archive containing `.ics` files. The application still has
no calendar account connection, external API, backend, runtime model call, or
network-dependent interpretation.

## Product promise

Maybe Tomorrow. is a private, explainable brake for an overfull day. It can look
at the shape of a calendar only after the user deliberately brings a snapshot
into the browser. It does not infer what an event means from its title and it
does not claim authority over the user's commitments.

The complete experience has two connected paths:

1. **Quick Check** asks seven questions about one proposed activity and returns
   exactly one of the existing three verdicts.
2. **Today Map** lets the user inspect a local calendar snapshot, label the
   flexibility and energy character of its events, and use that context when
   evaluating one more activity.

## Privacy boundary

- File contents are read in the current browser tab.
- Calendar data and completed decisions are stored only in browser storage.
- Nothing is uploaded or transmitted to a remote service.
- No event-title classification, semantic inference, or generated explanation
  is performed.
- The interface must state this boundary before import and near saved data.
- A restrictive Content Security Policy should prevent accidental third-party
  connections while allowing the static application to run on GitHub Pages.

## Calendar snapshot import

The importer accepts:

- one or more `.ics` files;
- a `.zip` archive containing `.ics` files; and
- the bundled fictional demo snapshot.

The parser must use a mature bundled iCalendar library and support ordinary
timed events, all-day events, recurring occurrences within a bounded date
window, and timezone-aware date values. Malformed files should produce a useful
error without destroying the currently loaded snapshot.

Safety limits:

- at most 10 source files per import;
- at most 5 MB compressed input;
- at most 20 MB total uncompressed calendar text;
- at most 2,000 rendered occurrences;
- recurrence expansion is limited to the snapshot date window.

The bundled demo is fictional, pre-labelled, and immediately useful in a live
hackathon demonstration. User-imported events begin unlabelled.

## Human event classification

The app may use event times and durations as facts. Meaning is provided only by
the user through four independent labels:

- **Fixed** — cannot move today;
- **Movable** — may move to another day;
- **Reducible** — may become shorter or smaller;
- **High energy** — costs more capacity than its duration suggests.

An event may also be protected as **Recovery**. Recovery is never offered as a
source of room by the Replacement Solver. Fixed and Recovery events are visible
constraints, not optimization targets.

## Today Map

The Today Map is a calm chronological view for one selected date. It shows:

- events and open time in order;
- overlapping commitments;
- total scheduled time;
- the longest open interval;
- counts of fixed, movable, reducible, high-energy, and recovery events;
- a simple day-pressure summary derived only from time and user labels.

The visualization must remain readable at 360 px and must not become a generic
calendar editor. Events cannot be rescheduled by dragging.

## Replacement Solver

When the user asks whether one more activity fits, the solver proposes small,
deterministic ways to make honest room. A plan may:

- postpone a user-labelled Movable event; or
- reduce a user-labelled Reducible event.

It may not move Fixed or Recovery events. It may not inspect an event title. It
returns a small set of stable, ranked alternatives and explains the arithmetic
used. Plans are permission, not instructions; the user chooses whether to accept
one.

The solver ranks plans by:

1. fewest changed events;
2. least total calendar disruption;
3. sufficient relief for the proposed activity;
4. stable chronological ordering.

## Cost of Yes

Every result can expose a counterfactual explanation: the smallest changes to
the seven Quick Check answers that would have produced a more permissive
verdict. This is an exhaustive deterministic search over the finite answer
space. It reports changed facts and score consequences; it does not prescribe
what the user should feel or claim that their answers are wrong.

## Decision Journal

Completed decisions can be saved locally with optional day context and an
accepted replacement plan. Existing MVP history must migrate safely into the
new journal shape. The journal supports review, individual deletion, and a
confirmed clear-all action. No draft or imported calendar is uploaded.

## Visual direction

The revised interface should feel quiet, humane, and slightly dreamy while
remaining highly legible. Use a low-contrast paper background, deep botanical
text, muted sage and dusk-blue surfaces, soft corners, and restrained motion.
Avoid gradients, glass effects, gamification, dense dashboards, and productivity
score theatre.

## Demonstration path

The primary live demo should work without user files:

1. load the fictional overfull-day snapshot;
2. inspect the pre-labelled Today Map;
3. propose one more activity;
4. complete Quick Check;
5. receive a verdict with transparent factors;
6. inspect Cost of Yes;
7. compare minimal replacement plans;
8. save the decision and plan to the local journal.

Quick Check must also remain available as a direct, context-free path.

## Acceptance criteria

- The app has no runtime AI, external API, backend, authentication, analytics,
  or cloud calendar connection.
- Imported calendar titles are never used for classification or scoring.
- The fictional demo completes the full vertical slice without file access.
- `.ics` and `.zip` import failures are bounded and recoverable.
- Recurrence, timezone, overlap, solver, counterfactual, and storage migration
  logic have deterministic tests.
- Existing scoring boundaries and exactly three verdicts are preserved.
- The app works with keyboard, touch, and mouse at 360 px without horizontal
  scrolling and respects `prefers-reduced-motion`.
- `npm test` and `npm run build` succeed.

---

— Codex
