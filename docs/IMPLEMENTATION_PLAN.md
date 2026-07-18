# Implementation Plan

## 1. Goal

Build the entire Maybe Tomorrow. MVP in one implementation pass, then use follow-up passes only for Yoshie Yamada’s review corrections and submission polish.

The implementation should favor clarity, reliability, and demonstrability over extensibility.

## 2. Project bootstrap

Initialize a Vite project with React and TypeScript in the repository root.

Expected commands:

```bash
npm install
npm run dev
npm run test
npm run build
```

Recommended dependencies:

- production: `react`, `react-dom`
- development: `typescript`, `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, React testing utilities only if genuinely useful

Avoid additional dependencies unless they remove substantial complexity.

## 3. Suggested file structure

```text
.github/
  workflows/
    deploy.yml
public/
src/
  app/
    App.tsx
    appState.ts
  components/
    ActivityStep.tsx
    QuestionStep.tsx
    ShrinkStep.tsx
    ResultStep.tsx
    HistorySection.tsx
    StoryDisclosure.tsx
    ComingSoon.tsx
    Footer.tsx
  domain/
    types.ts
    questions.ts
    scoring.ts
    explanations.ts
  storage/
    history.ts
  styles/
    global.css
  test/
    scoring.test.ts
    storage.test.ts
  main.tsx
index.html
AGENTS.md
CODEX_WORKLOG.md
docs/
```

Codex may simplify the component split if the resulting code remains readable.

## 4. Application state

Use local React state. Do not add a state-management library.

Suggested state machine:

```ts
type AppStage =
  | "landing"
  | "activity"
  | "questions"
  | "shrink"
  | "result";
```

Store:

- activity string;
- current question index;
- partial answers;
- shrinkable answer;
- final decision object;
- non-blocking storage warning;
- history refresh key or state.

Required behavior:

- Back navigation preserves previous answers.
- `Try another` resets the active decision but preserves saved history.
- Refreshing during an incomplete decision may reset the flow; persistence of drafts is not required.
- Refreshing after saving keeps history.

## 5. Domain types

Define explicit types for:

```ts
type ScoreValue = 0 | 1 | 2 | 3 | 4;

type Verdict = "postpone" | "reduce" | "proceed";

type FactorKey =
  | "urgency"
  | "commitment"
  | "desire"
  | "energyCost"
  | "dayLoad"
  | "recoveryNeed"
  | "tomorrowFlexibility";

type Decision = {
  id: string;
  activity: string;
  inputs: DecisionInputs;
  score: number;
  verdict: Verdict;
  factors: FactorKey[];
  createdAt: string;
};
```

Use `crypto.randomUUID()` when available and a safe local fallback when not.

## 6. Scoring implementation

Implement pure functions:

```ts
calculatePostponeScore(inputs: DecisionInputs): number
chooseVerdict(inputs: DecisionInputs): Verdict
selectExplanationFactors(inputs: DecisionInputs, verdict: Verdict): FactorKey[]
createDecision(activity: string, inputs: DecisionInputs): Decision
```

Follow `docs/SCORING.md` exactly.

No scoring logic should exist inside React components.

## 7. Question configuration

Store question definitions as data, not duplicated JSX.

Each question should include:

- key;
- heading;
- five option labels;
- values 0–4;
- optional supporting text.

Render one reusable question component.

Do not use a range slider. Five discrete buttons are easier to understand, tap, test, and narrate in a demo.

## 8. Local storage

Use a versioned key:

```text
maybe-tomorrow:history:v1
```

Required functions:

```ts
loadHistory(): StorageResult<Decision[]>
saveDecision(decision: Decision): StorageResult<Decision[]>
deleteDecision(id: string): StorageResult<Decision[]>
clearHistory(): StorageResult<Decision[]>
```

Requirements:

- cap stored history at 50 items;
- newest first;
- catch storage exceptions;
- validate parsed objects before display;
- ignore malformed records rather than crashing;
- app remains usable when storage is disabled or full.

## 9. UI implementation order

Implement in this order:

1. global styles and page shell;
2. landing and origin story;
3. activity input and validation;
4. reusable question flow;
5. shrinkable follow-up;
6. scoring engine and tests;
7. result view and factor copy;
8. history storage and controls;
9. how-it-works and coming-soon sections;
10. accessibility and responsive pass;
11. GitHub Pages workflow;
12. README and worklog updates.

## 10. GitHub Pages

Configure Vite for repository deployment.

Expected production base:

```ts
base: "/maybe-tomorrow/"
```

Add `.github/workflows/deploy.yml` using the standard GitHub Pages artifact workflow.

The workflow should:

- run on pushes to `main`;
- install with `npm ci`;
- run tests;
- run build;
- upload `dist`;
- deploy to GitHub Pages.

Do not hard-code secrets. No secrets are required.

If automatic Pages deployment requires a repository setting that Codex cannot change, document the exact setting Yoshie must enable.

## 11. Test plan

### Unit tests

Required:

- scoring boundaries;
- three guardrails;
- stable factor selection;
- representative scenarios;
- history parsing and malformed data;
- history cap at 50;
- storage exceptions where feasible.

### Manual acceptance pass

Test at minimum:

- 360 × 800 mobile viewport;
- 768 × 1024 tablet viewport;
- 1440 × 900 desktop viewport;
- keyboard-only completion;
- browser refresh after saving;
- clear history cancellation and confirmation;
- reduced-motion mode;
- very long valid 80-character activity;
- HTML-like activity text displays as text, never markup.

## 12. Acceptance criteria

The implementation is complete when all are true:

- [ ] A first-time user sees the anti-productivity premise immediately.
- [ ] The origin story is available but does not block the main flow.
- [ ] Activity validation follows the product spec.
- [ ] All seven scored questions and the binary shrink question are present.
- [ ] The deterministic formula and guardrails match `docs/SCORING.md`.
- [ ] Exactly three verdict categories exist.
- [ ] Each result names the activity and explains up to three factors.
- [ ] Raw score is not displayed by default.
- [ ] Completed decisions can be saved, viewed, deleted, and cleared locally.
- [ ] Storage failure does not block scoring.
- [ ] Coming-soon integrations are clearly not implemented.
- [ ] Footer contains the medical-boundary note.
- [ ] The app is usable on mobile and by keyboard.
- [ ] Reduced motion is respected.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] GitHub Pages deployment configuration exists.
- [ ] `CODEX_WORKLOG.md` accurately records Codex’s work and ends with `— Codex`.
- [ ] README status and run instructions are updated.

## 13. Scope-cut order

If time becomes constrained, cut in this order:

1. decorative paper texture;
2. automatic answer transitions;
3. advanced history filtering;
4. offline/PWA enhancement;
5. elaborate motion;
6. optional tablet/desktop layout embellishments.

Never cut:

- scoring correctness;
- three verdicts;
- result explanations;
- mobile usability;
- history basics;
- accessibility basics;
- tests;
- authorship record.

## 14. Final review checklist for Yoshie

Yoshie’s review should focus on:

- Does the app feel like permission rather than judgment?
- Is it funny enough without becoming a joke?
- Does the result copy sound natural aloud?
- Is the personal story accurate and appropriately brief?
- Does the app resist encouraging one more project?
- Is the primary demo understandable within 30 seconds?

---

— Templex Tsukino