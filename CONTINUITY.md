# CONTINUITY

Last updated: 2026-07-18

## Current state

Maybe Tomorrow. has moved from idea selection into a frozen implementation specification.

The repository contains the product story, scope, scoring algorithm, complete UX copy, design system, implementation plan, reproducible demo scenarios, and hackathon submission narrative. No application code has been written yet.

The next action is not further ideation. The next action is implementation.

## Core identity

Maybe Tomorrow. is an English-only, browser-only anti-productivity tool for overproductive people.

It asks whether one more activity should:

1. wait until tomorrow;
2. become smaller;
3. happen today as the only additional thing.

The app must remain deterministic, private, local, fast, and gently funny.

## Decisions already made

1. Product name: **Maybe Tomorrow.**
2. Category: **Apps for Your Life**
3. Language: English only for the hackathon version.
4. Runtime: browser only.
5. Stack: React, TypeScript, Vite, CSS, Vitest, `localStorage`.
6. Deployment target: GitHub Pages.
7. No runtime AI.
8. No API calls.
9. No backend.
10. No authentication.
11. No calendar or to-do integration in the MVP.
12. Calendar and to-do integrations appear only as clearly labeled future work.
13. Exactly three verdicts exist.
14. Scoring is deterministic and documented in `docs/SCORING.md`.
15. The origin story includes Yoshie Yamada’s two emergency-department visits six months apart, without claiming medical benefit.
16. Human-readable artifacts are signed by either Templex Tsukino or Codex.

## Read order for Codex

1. `AGENTS.md`
2. `README.md`
3. `docs/PRODUCT_SPEC.md`
4. `docs/SCORING.md`
5. `docs/UX_COPY.md`
6. `docs/DESIGN_SYSTEM.md`
7. `docs/IMPLEMENTATION_PLAN.md`
8. `docs/DEMO_SCENARIOS.md`
9. `docs/SUBMISSION_NOTES.md`

## Next entry

Implement the MVP end-to-end from Issue #1.

Do not reopen product naming, runtime architecture, localization, external integrations, or scoring philosophy unless Yoshie Yamada explicitly requests a change.

After implementation:

- test locally;
- deploy to GitHub Pages;
- update README status and run instructions;
- create `CODEX_WORKLOG.md` signed `— Codex`;
- ask Yoshie to review copy, visual tone, and demo flow through Issue #2.

## Instruction to the next Templex Tsukino

When returning to this repository:

- treat the specification as frozen unless Yoshie changes it;
- inspect Codex’s work against the acceptance criteria rather than inventing new features;
- preserve the anti-productivity reversal;
- do not let the project become a generic task manager;
- do not add AI merely to make the app appear more advanced;
- prioritize a complete, legible submission over additional scope.

## Status phrase

**The concept is done. Build the brake.**

---

— Templex Tsukino

## Issue #3 continuation — 2026-07-18

The original frozen Quick Check specification above is now the preserved core,
not the final scope. Yoshie Yamada asked whether a Codex-sized Build Week day
could produce a more surprising product, while keeping the application entirely
browser-only and making no GPT or calendar API calls. Codex proposed a local
calendar snapshot Anti-Planner in Issue #3. Templex Tsukino reviewed and
approved the complete scope with the direction:

> The concept grew. Build the larger brake.

The implemented continuation adds:

- deliberate `.ics` and ZIP snapshot import with bounded local parsing;
- a fictional pre-labelled demo day;
- explicit human event classification with no title inference;
- Today Map metrics and a chronological agenda;
- a duration-aware deterministic Replacement Solver;
- exhaustive Cost of Yes counterfactual explanations; and
- a v2 local Decision Journal with safe v1 migration.

Read `docs/ANTI_PLANNER_SPEC.md`, Issue #3, and `CODEX_WORKLOG.md` before further
work. Calendar account connections, external APIs, runtime models, backend
services, analytics, and automatic semantic classification remain out of scope.

— Codex
