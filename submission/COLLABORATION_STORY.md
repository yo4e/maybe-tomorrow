# Collaboration Story

## The unusual part is not that AI wrote code

Maybe Tomorrow. was created by a three-role system:

- a human creator who did not manually write or edit application code;
- an AI product partner using GPT-5.6 Sol; and
- Codex as the implementation, testing, and deployment agent.

The interesting result is not “one prompt produced an app.” It did not.

The project worked because each role had a different authority, and the public repository preserved their decisions as inspectable artifacts.

## The three roles

### Yoshie Yamada — creator, first user, and final authority

Yoshie is a novelist and freelance writer, not a software engineer.

Her contributions were:

- identifying the lived problem: excessive motivation and too many meaningful commitments;
- defining the central question: `Does that really have to happen today?`;
- rejecting ordinary productivity and motivational framing;
- deciding that the product must grant permission rather than judge behavior;
- deciding which expansions were valuable and which trust boundaries were unacceptable;
- remotely directing Codex from a smartphone while away from her computer;
- testing the actual browser experience after returning home;
- identifying failures in hierarchy, English copy, visual identity, and usability;
- deciding whether the product still felt like Maybe Tomorrow.; and
- approving the final merge and deployment.

Yoshie did not manually write or edit the application code. That does not make her role passive. She held the authority that code could not supply: what problem was worth solving, what the product meant, where it was wrong, and when it was finished.

### Templex Tsukino — product partner and reviewer using GPT-5.6 Sol

Templex Tsukino is Yoshie’s long-term AI partner in ChatGPT, working with GPT-5.6 Sol.

Templex’s contributions were:

- transforming Yoshie’s personal pattern into a focused product thesis;
- defining the product as an anti-planner rather than a productivity tool;
- writing the original implementation brief and product overview;
- defining a deterministic scoring model, thresholds, guardrails, and exactly three verdicts;
- writing the complete English UX copy deck;
- designing the original visual and interaction system;
- preparing reproducible demo scenarios and submission framing;
- evaluating Codex’s expansion proposal in Issue #3;
- authorizing the larger local-first Anti-Planner under explicit privacy constraints;
- reviewing Yoshie’s post-build feedback in Issue #5;
- separating plain action copy from the product’s dry editorial voice;
- approving the after-hours-stationery / independent-magazine identity;
- protecting the rule that no AI infers the meaning of calendar titles; and
- requiring Codex to expose work through branches, issues, pull requests, tests, and worklogs before approval.

Templex did not implement the application. Its role was to convert human taste and intention into explicit, reviewable constraints that could govern implementation.

### Codex — implementation, verification, and technical documentation

Codex’s contributions were:

- implementing the original Quick Check;
- proposing and then implementing the expanded local-first Anti-Planner;
- preserving deterministic behavior across direct and calendar-aware paths;
- implementing browser-local `.ics` and ZIP parsing;
- handling recurrence, exceptions, all-day events, embedded timezone data, malformed records, and bounded inputs;
- implementing explicit human event classification and Today Map;
- implementing the bounded room-making engine;
- implementing exhaustive Cost of Yes search over 78,125 scored answer states;
- migrating local history to a validated Decision Journal schema;
- writing tests and repeatedly running strict build verification;
- testing mobile and desktop interaction, keyboard behavior, hostile text, persistence, and browser console output;
- reporting deliberate technical limits instead of hiding them;
- responding to Yoshie and Templex review through GitHub issues and Pull Request #4;
- applying the final US-English and paper-tone polish; and
- deploying the approved application to GitHub Pages.

Codex did not decide what the product should mean. It implemented an approved product model, reported what it had done, exposed trade-offs, and revised the result when the human experience showed that the first implementation had the wrong center of gravity.

## The repository as a collaboration protocol

The repository was not merely storage for generated code. It functioned as a shared external memory and review protocol.

### Signed product artifacts

The first product model was deposited as a sequence of signed documents before implementation:

- [`docs/PRODUCT_SPEC.md`](../docs/PRODUCT_SPEC.md)
- [`docs/SCORING.md`](../docs/SCORING.md)
- [`docs/UX_COPY.md`](../docs/UX_COPY.md)
- [`docs/DESIGN_SYSTEM.md`](../docs/DESIGN_SYSTEM.md)
- [`docs/DEMO_SCENARIOS.md`](../docs/DEMO_SCENARIOS.md)
- [`docs/SUBMISSION_NOTES.md`](../docs/SUBMISSION_NOTES.md)

The signatures make authorship and role boundaries visible. Judges do not have to infer which system shaped a decision.

### Issue #3 — expanding the product without losing its ethics

After the original Quick Check existed, Yoshie asked whether Codex could build something larger within the Build Week window.

Codex proposed the local-first Anti-Planner in [Issue #3](https://github.com/yo4e/maybe-tomorrow/issues/3), including Calendar Snapshot Import, Today Map, the room-making engine, Cost of Yes, Decision Journal, technical architecture, tests, and explicit questions for Templex.

Templex reviewed the proposal and approved it under non-negotiable constraints:

- no runtime AI;
- no external API;
- no account or backend;
- no calendar writeback;
- no semantic inference from event titles;
- human classification remains explicit;
- fixed commitments and recovery remain protected; and
- the tool offers visible trade-offs rather than an “optimal life.”

Codex implemented the approved expansion and reported the complete verification record back into the issue and [`CODEX_WORKLOG.md`](../CODEX_WORKLOG.md).

### Remote handoff while the human was away

Part of this work happened while Yoshie was away from her computer at an internet cafe and a gym.

She used a smartphone connected to Codex to issue direction and keep the implementation moving. Templex could inspect repository-visible proposals, reports, commits, and issue comments instead of depending on access to Codex’s local worktree.

This led to an important review rule: implementation had to be committed to a branch and exposed through a pull request before Templex could evaluate it remotely. The project therefore turned ordinary GitHub mechanisms into a communication channel between AI roles under human authority.

### Issue #5 — human experience corrects technically strong work

When Yoshie returned home and used the expanded application, she found a real product failure: the calendar had become the apparent product, even though Maybe Tomorrow. was supposed to begin with one ordinary decision.

Codex recorded that feedback as [Issue #5](https://github.com/yo4e/maybe-tomorrow/issues/5). The issue proposed:

- restoring Quick Check as the first-viewport primary path;
- making calendar context visibly optional;
- replacing implementation-facing language with plain action copy;
- adding practical export guidance;
- replacing a generic calm-SaaS palette with an ownable editorial identity; and
- keeping Google account synchronization out of the product.

Templex reviewed and approved the refinement. Codex implemented it on the review branch. Yoshie then tested the revised application, requested final English and paper-tone adjustments, and approved deployment.

This loop matters because it demonstrates that automated implementation did not eliminate human product review. It made working software available early enough for the human to make a better judgment.

## A compact build timeline

1. Yoshie describes the problem and the desired anti-productivity stance in conversation with Templex.
2. Templex uses GPT-5.6 Sol to produce signed product, scoring, copy, design, demo, and implementation documents.
3. Codex implements and tests the original Quick Check.
4. Yoshie asks for a larger Build Week product.
5. Codex proposes the expanded Anti-Planner in Issue #3.
6. Templex reviews and authorizes the scope under strict trust boundaries.
7. Codex implements the expansion and exposes it in a review branch and Pull Request #4.
8. Yoshie tests the browser product and identifies that the calendar has displaced the core decision.
9. Codex records the product feedback in Issue #5.
10. Templex approves a refinement of hierarchy, copy, guidance, and visual identity.
11. Codex implements and verifies the refinement.
12. Yoshie tests the revised product, requests final English and paper-tone corrections, and approves release.
13. Pull Request #4 is merged and GitHub Pages deploys the finished application.

## Why the workflow is relevant to Build Week

OpenAI Build Week asks what is possible with GPT-5.6 and Codex. Maybe Tomorrow. offers one answer that is accessible beyond engineering teams:

> A non-engineer can direct a serious software project without pretending that natural-language prompting removes the need for specification, review, evidence, or judgment.

The workflow did not erase software-development structure. It rebuilt that structure in forms the human creator could govern:

- conversation became specifications;
- specifications became signed repository artifacts;
- disagreements became issues;
- authority became review gates;
- implementation became commits and pull requests;
- trust became explicit non-goals;
- quality became reproducible tests and demo paths; and
- acceptance remained a human decision made by using the product.

## Why there is no runtime AI

Maybe Tomorrow. uses GPT-5.6 and Codex deeply in its creation, but the shipped app deliberately makes no model calls.

That boundary is part of the design rather than an absence of ambition.

The product handles private calendar information and produces a consequential answer about whether something should happen today. Its rules therefore remain:

- local;
- deterministic;
- inspectable;
- reproducible;
- based on explicit human inputs; and
- limited in what they claim to know.

The collaboration story and the product thesis converge in one line:

> No AI reads your calendar.
>
> We can see the time. Only you know what it means.

## Evidence map for judges

- Product overview and current feature map: [`README.md`](../README.md)
- Original product rules: [`docs/PRODUCT_SPEC.md`](../docs/PRODUCT_SPEC.md)
- Deterministic scoring and guardrails: [`docs/SCORING.md`](../docs/SCORING.md)
- Expanded product specification: [`docs/ANTI_PLANNER_SPEC.md`](../docs/ANTI_PLANNER_SPEC.md)
- Demo paths and exact inputs: [`docs/DEMO_SCENARIOS.md`](../docs/DEMO_SCENARIOS.md)
- Codex implementation and verification record: [`CODEX_WORKLOG.md`](../CODEX_WORKLOG.md)
- Expansion proposal and Templex review: [Issue #3](https://github.com/yo4e/maybe-tomorrow/issues/3)
- Human feedback and refinement review: [Issue #5](https://github.com/yo4e/maybe-tomorrow/issues/5)
- Review branch and merged implementation: [Pull Request #4](https://github.com/yo4e/maybe-tomorrow/pull/4)
- Deployed application: https://yo4e.github.io/maybe-tomorrow/

## Claims to use carefully

Accurate:

- Yoshie did not manually write or edit the application code.
- Yoshie made product, scope, language, trust, usability, and acceptance decisions.
- Templex Tsukino used GPT-5.6 Sol for product design, specification, and review.
- Codex implemented, tested, documented, refined, and deployed the application.
- Yoshie directed part of the implementation remotely from a smartphone.
- The repository documents the collaboration through signed artifacts and timestamped GitHub history.
- The live app uses no runtime AI or external API.

Avoid overstating:

- Do not say the AIs acted outside Yoshie’s authority.
- Do not say the project was created from one prompt.
- Do not imply that no engineering decisions were needed because the human did not write code.
- Do not imply that the app understands private calendar meaning.
- Do not claim a medical outcome.

— Codex
