# OpenAI Build Week Submission Kit

This directory is the canonical preparation space for the **Maybe Tomorrow.**
OpenAI Build Week submission. The application is shipped; this package turns
the finished product and its creation process into reproducible evidence for
judges.

## Submission position

- **Project:** Maybe Tomorrow.
- **Track:** Apps for Your Life
- **Live app:** <https://yo4e.github.io/maybe-tomorrow/>
- **Repository:** <https://github.com/yo4e/maybe-tomorrow>
- **Core pitch:** An anti-planner for people whose problem is not a lack of
  motivation, but too many worthwhile things competing for one finite day.
- **Build thesis:** A non-engineer novelist and freelance writer directed a
  documented human–AI–AI software-development loop without manually writing or
  editing application code.

## Canonical files

- [`DEMO_VIDEO_SCRIPT.md`](./DEMO_VIDEO_SCRIPT.md) — locked 2:30 story and
  truth boundaries.
- [`video/README.md`](./video/README.md) — complete video-production package.
- [`video/DEVPOST_FINAL.md`](./video/DEVPOST_FINAL.md) — final consolidated
  paste-ready submission copy.
- [`DEVPOST_SUBMISSION.md`](./DEVPOST_SUBMISSION.md) — audit record and route to
  the final copy.
- [`COLLABORATION_STORY.md`](./COLLABORATION_STORY.md) — detailed GPT-5.6 Sol,
  Templex Tsukino, Codex, and Yoshie Yamada workflow with repository evidence.
- [`assets/ASSET_MANIFEST.md`](./assets/ASSET_MANIFEST.md) — final fictional-data
  screenshots and thumbnails.

Older [`docs/SUBMISSION_NOTES.md`](../docs/SUBMISSION_NOTES.md) remains
historical material only. Where it conflicts, this package reflects the final
deployed Anti-Planner.

## The strongest judging story

Maybe Tomorrow. is not notable because a model writes advice at runtime. It
deliberately does not.

Its strongest claim is that the software itself was created through a
documented collaboration among three roles:

1. **Yoshie Yamada**, a novelist and freelance writer, supplied the lived
   problem, product judgment, qualitative testing, and final approval.
2. **Templex Tsukino**, Yoshie's long-term AI partner in ChatGPT using GPT-5.6
   Sol, transformed conversation into product architecture, deterministic
   rules, UX copy, design direction, privacy boundaries, and review gates.
3. **Codex** implemented, tested, documented, refined, and deployed the browser
   application.

The repository became their collaboration protocol. Signed specifications,
issues, commits, pull requests, review comments, tests, and worklogs make the
process inspectable instead of reducing it to “AI helped me code.”

Yoshie also directed part of the build remotely from a smartphone while at an
internet cafe and a gym. She returned home to test the browser experience,
identify failures in hierarchy, English, and visual identity, and approve the
release. Codex finished the approved release work while Yoshie attended a
local summer festival—a real-life example of the time the product is meant to
protect. The claim is directed build, including part remotely—not a fully
remote or autonomous build.

## Verified official requirements

The package was reconciled against the [OpenAI Build Week
page](https://openai.com/build-week/), [Devpost challenge
page](https://openai.devpost.com/), [official
rules](https://openai.devpost.com/rules), and [official
FAQ](https://openai.devpost.com/details/faqs) on July 19, 2026.

- The demo is designed for `2:30` and must remain shorter than `3:00`.
- The YouTube video must be **Public**, not merely available as Unlisted.
- Audible English narration explains both GPT-5.6 and Codex use.
- The public repository includes setup, sample data, tests, collaboration
  decisions, MIT licensing, and third-party notices.
- `/feedback` must be run in the primary Codex task where the majority of core
  functionality was built. Its Session ID belongs in Devpost, not the repo.
- The deadline is July 21, 2026 at 5:00 PM PDT / July 22, 2026 at 9:00 AM JST.
- Registration, eligibility, rights confirmations, and any fields shown only
  after joining Devpost require Yoshie's account and judgment.

## Prepared submission checklist

- [x] Working project built during the submission period with GPT-5.6 and
      Codex.
- [x] Track selected: **Apps for Your Life**.
- [x] Public deployed application.
- [x] Public repository with exact setup, sample, test, architecture, and
      collaboration documentation.
- [x] MIT project license and verified third-party license notices.
- [x] README describes how GPT-5.6 Sol and Codex contributed and accelerated
      the build.
- [x] Reproducible fictional sample day requiring no personal calendar data.
- [x] Locked 283-word narration, synchronized 2:30 English caption timeline,
      optional timing-matched Japanese SRT, personal-footage plan, shot list,
      answer keys, reset procedure, fallback path, and recording runbook.
- [x] Desktop/mobile screenshot set, contact sheet, and original thumbnail
      sources.
- [x] Issue #7 source/semantic audit, measured text contrast, Home Lighthouse
      check, targeted focus/error fixes, and seven accessibility regressions.
- [ ] Yoshie performs a short keyboard/VoiceOver spot-check, or leaves the
      pending matrix explicitly unclaimed.
- [ ] Yoshie or Templex reviews and approves the final submission PR.
- [x] Yoshie's two silent B-roll shots were recorded and incorporated into
      sanitized local working copies.
- [x] Yoshie approved the revised visual edit, personal-media crops, original
      music treatment, and the festival segment after confirming that it shows
      no disallowed trademark logo.
- [x] Codex replaced the rejected macOS Samantha System Voice candidate with
      Kokoro-82M `af_heart` and repeated technical, frame-identity, audio,
      timing, clipping, and metadata QA on the English-only submission master.
- [ ] Yoshie re-approves the replacement narration and complete English edit
      with headphones. The Japanese-captioned edition is optional work after
      submission, not a submission dependency.
- [ ] Yoshie uploads the video as **Public** and verifies signed-out playback.
- [ ] Yoshie runs `/feedback` in the primary Codex build task.
- [ ] Yoshie joins Devpost, confirms eligibility and rights, fills any
      account-only fields, and submits.

## Human-only values

```text
Public YouTube demo: {{YOUTUBE_URL}}
Codex /feedback Session ID: {{FEEDBACK_SESSION_ID}}
Public Devpost project: {{DEVPOST_URL}}
```

Do not replace the Session ID placeholder in the public repository. Paste the
real value directly into Devpost.

## Prepared screenshot set

1. Home at `1440 × 900` with **Check one thing** first.
2. **Maybe tomorrow.** verdict for `Start another side project`.
3. Open **What would need to change?** with deterministic alternatives.
4. Fictional Today Map with all four factual metrics.
5. Fictional calendar-aware verdict and room-making preview.
6. Detailed room-making plan and bounded-search proof.
7. Home at `390 × 844`.
8. Core verdict at `390 × 844`.

See [`assets/storyboard.html`](./assets/storyboard.html) for the sequence.

## Accuracy boundaries

- The live app uses no runtime AI.
- No AI reads or semantically interprets event titles.
- Calendar snapshots are parsed only in the current browser tab.
- The app does not connect to, synchronize with, or edit Google Calendar.
- Cost of Yes checks all 78,125 scored Quick Check combinations.
- The room-making engine searches bounded combinations of changes explicitly
  authorized by human labels.
- Plans are previews, not automatic calendar edits.
- The fictional sample has `0 min` overlapping time.
- The product makes no medical claim and does not claim accessibility
  certification.
- The prior macOS Samantha System Voice render was rejected during the license
  audit and will not be published. The rights-cleared replacement uses
  Kokoro-82M's `af_heart` voice under Apache-2.0. Renewed technical QA passed;
  Yoshie's complete-file listening approval remains the publication gate.
- Kokoro, Misaki, and the Kokoro-82M model are local video-production tools;
  they are not part of the application, production JavaScript bundle, or
  browser runtime. See [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)
  for the conservative public credit.
- Yoshie did not manually write or edit application code. She made the product,
  scope, trust, language, usability, and acceptance decisions governing it.

## Final pre-submit verification

1. Merge only after Yoshie or Templex reviews the submission PR.
2. Confirm the post-merge GitHub Pages deployment.
3. Open the public app in a clean browser session and run both exact demo paths.
4. Complete [`video/QA_CHECKLIST.md`](./video/QA_CHECKLIST.md) again for the
   Kokoro-narrated English master; do not carry forward pass results from the
   rejected System Voice candidate.
5. Confirm YouTube Studio says **Public** and the video plays while signed out.
6. Confirm the repository remains public with `LICENSE` and
   `THIRD_PARTY_NOTICES.md`.
7. Run `/feedback` in the primary Codex build task and keep its Session ID out
   of the repository.
8. Preview the Devpost form and remove every unresolved placeholder before
   pressing Submit.

— Codex
