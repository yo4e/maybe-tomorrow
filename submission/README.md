# OpenAI Build Week Submission Kit

This directory is the canonical preparation space for the **Maybe Tomorrow.** OpenAI Build Week submission.

The application itself is already deployed. These files translate the finished product and its unusual creation process into materials for judges.

## Submission position

- **Project:** Maybe Tomorrow.
- **Track:** Apps for Your Life
- **Live app:** https://yo4e.github.io/maybe-tomorrow/
- **Repository:** https://github.com/yo4e/maybe-tomorrow
- **Core pitch:** An anti-planner for people whose problem is not a lack of motivation, but too many worthwhile things competing for one finite day.
- **Build story:** A non-engineer novelist and freelance writer directed a human–AI–AI development loop without manually writing or editing application code.

## Files in this kit

- [`DEMO_VIDEO_SCRIPT.md`](./DEMO_VIDEO_SCRIPT.md) — a complete under-three-minute public YouTube demo script, shot list, and exact test inputs.
- [`DEVPOST_SUBMISSION.md`](./DEVPOST_SUBMISSION.md) — ready-to-paste project description sections for Devpost.
- [`COLLABORATION_STORY.md`](./COLLABORATION_STORY.md) — the detailed GPT-5.6 Sol, Templex Tsukino, Codex, and Yoshie Yamada workflow, with repository evidence.

Older notes in [`docs/SUBMISSION_NOTES.md`](../docs/SUBMISSION_NOTES.md) remain useful historical material, but this directory reflects the final deployed Anti-Planner and is the submission source of truth.

## The strongest judging story

Maybe Tomorrow. is not notable because an AI writes advice at runtime. It deliberately does not.

Its strongest claim is that **the software itself was created through a documented collaboration between a human creator and two complementary AI roles**:

1. **Yoshie Yamada**, a novelist and freelance writer with no software-engineering role, supplied the lived problem, product judgment, qualitative testing, and final approval.
2. **Templex Tsukino**, Yoshie’s long-term AI partner in ChatGPT using GPT-5.6 Sol, transformed conversation into product architecture, deterministic rules, UX copy, design direction, review gates, and signed repository documents.
3. **Codex** implemented, tested, documented, refined, and deployed the browser application.

The repository became their shared workspace. Specifications, issues, commits, pull requests, review comments, worklogs, and signatures make the process inspectable rather than reducing it to an unsupported claim that “AI helped.”

Yoshie also directed the build remotely. While away from her computer at an internet cafe and a gym, she used a smartphone connected to Codex to issue instructions and continue the build. She returned home to test the finished experience in the browser, report where the product hierarchy and English copy were wrong, and approve the final deployment.

## Official submission checklist

- [x] Working project built during the submission period with Codex and GPT-5.6.
- [x] Chosen track: **Apps for Your Life**.
- [x] Public working application.
- [x] Public code repository with setup, sample-data, demo, test, and architecture documentation.
- [x] README identifies how GPT-5.6 Sol, Templex Tsukino, and Codex contributed.
- [x] Reproducible fictional sample day; judges do not need to provide personal calendar data.
- [ ] Record a demo video shorter than three minutes.
- [ ] Include audible explanation of both Codex and GPT-5.6 use.
- [ ] Upload the demo as a **public YouTube video**.
- [ ] Paste the final YouTube URL into Devpost and this file.
- [ ] Run `/feedback` in the primary Codex build thread and paste the Session ID into Devpost.
- [ ] Choose and add an explicit repository license before submission. The repository is public, but license selection is a human legal decision and has intentionally not been guessed here.
- [ ] Take the final screenshot set.
- [ ] Complete and submit the Devpost form.

## Manual values still needed

```text
Public YouTube demo URL: [ADD]
Codex /feedback Session ID: [ADD]
Devpost project URL: [ADD]
Repository license: [CHOOSE AND ADD]
```

## Recommended screenshot set

1. Landing page with `You do not need help doing more.` and the direct **Check one thing** action.
2. **Maybe tomorrow.** verdict for `Start another side project`.
3. Open **What would need to change?** result showing deterministic alternatives.
4. Fictional Today Map with protected recovery, overlaps, and the longest opening.
5. Open **See what would have to move** preview.
6. GitHub Issue #3 or Issue #5 showing the Templex review gate and Codex implementation response.
7. Commit history showing signed Templex specifications followed by Codex implementation commits.

## Accuracy boundaries

State these points clearly:

- The live application uses **no runtime AI**.
- No AI reads or semantically interprets calendar titles.
- Calendar files are parsed only in the current browser tab.
- The app does not connect to, synchronize with, or edit Google Calendar.
- The Cost of Yes exhaustively searches all 78,125 scored Quick Check combinations.
- The room-making engine searches bounded combinations of changes explicitly authorized by human labels.
- Plans are previews, not automatic calendar edits.
- The product makes no medical claim and is not an accessibility certification.
- Yoshie did not manually write or edit the application code; this does not mean she was absent from engineering decisions. She made the product, scope, trust, language, and acceptance decisions that governed the code.

## Final pre-submit verification

Before pressing Submit:

1. Open the public app in a clean browser session.
2. Run the exact Quick Check and sample-day paths in the video script.
3. Confirm the public YouTube video plays while signed out.
4. Confirm the repository is public and has an explicit license.
5. Confirm the README and video both name Codex and GPT-5.6.
6. Confirm the `/feedback` Session ID is from the primary build thread.
7. Remove every `[ADD]` placeholder from the submitted copy.
