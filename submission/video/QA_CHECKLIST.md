# Final Submission QA

## Local video export

- [ ] Duration is shorter than `3:00`; target is `2:30`.
- [ ] English narration is audible from beginning to end.
- [ ] Yoshie explicitly says `GPT-5.6 Sol` and `Codex`.
- [ ] Yoshie states that she did not manually write or edit application code.
- [ ] Yoshie's creator, product-authority, testing, and approval role remains
      clear.
- [ ] Captions match [`TELEPROMPTER.txt`](./TELEPROMPTER.txt).
- [ ] No caption covers a control or important metric.
- [ ] The product and repository evidence remain legible at normal playback.
- [ ] There is no copyrighted music.
- [ ] No personal calendar, notification, account detail, or private tab is
      visible.
- [ ] The sample reports `0 min` overlapping time; the narration does not
      invent an overlap.
- [ ] The room-making plan shortens `Go to the gym` by `30 min`, leaves
      `5:00–6:00 PM` open, and reports `18 allowed combinations`.
- [ ] The video does not call snapshot import a live Google Calendar
      integration.
- [ ] The video does not imply that AI runs in the app, reads event titles,
      edits a calendar, provides medical advice, or certifies accessibility.

## Public YouTube upload

- [ ] YouTube Studio shows visibility **Public**, not Unlisted or Private.
- [ ] `{{YOUTUBE_URL}}` plays to the end in a signed-out/private browser.
- [ ] Title and description match [`YOUTUBE_METADATA.md`](./YOUTUBE_METADATA.md).
- [ ] Live app and repository links are clickable in the description.
- [ ] English captions are available and synchronized.
- [ ] Thumbnail is clear at small size.

## Repository and live product

- [ ] The final submission PR received Yoshie or Templex review before merge.
- [ ] GitHub Pages deployment succeeded after merge.
- [ ] Live home, core Quick Check, sample Today Map, and room-making path work.
- [ ] A keyboard/VoiceOver spot-check is recorded, or remaining assistive-
      technology coverage is left explicitly Pending without a certification
      claim.
- [ ] Repository is public.
- [ ] Root `LICENSE` is MIT with Yoshie Yamada's 2026 copyright notice.
- [ ] `THIRD_PARTY_NOTICES.md` is present and does not relicense dependencies.
- [ ] README names GPT-5.6, Templex Tsukino, and Codex contributions.
- [ ] `npm test`, `npm run build`, `npm run verify:submission`, and
      `git diff --check` pass on the reviewed commit.

## Devpost form

- [ ] Yoshie has joined the challenge and confirmed eligibility and rights.
- [ ] Track is **Apps for Your Life**.
- [ ] Project copy comes from [`DEVPOST_FINAL.md`](./DEVPOST_FINAL.md).
- [ ] Public video URL is pasted in the correct field.
- [ ] `/feedback` was run in the primary Codex build task.
- [ ] `{{FEEDBACK_SESSION_ID}}` is pasted only into Devpost, not the repository.
- [ ] App, repository, screenshot, and thumbnail links/files are present.
- [ ] No unresolved placeholder remains in the submitted form.
- [ ] Preview has been checked before pressing Submit.
- [ ] Submission is complete before July 21, 2026 at 5:00 PM PDT / July 22,
      2026 at 9:00 AM JST.

Final values for the human's private checklist:

```text
Public YouTube demo: {{YOUTUBE_URL}}
Codex feedback Session ID: {{FEEDBACK_SESSION_ID}}
Public Devpost project: {{DEVPOST_URL}}
```

Do not replace the Session ID placeholder in this public repository.

— Codex
