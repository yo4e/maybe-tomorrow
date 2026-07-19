# Final Submission QA

## Confirmed edit decisions

- [x] Yoshie approved the complete visual edit and personal-footage crops.
- [x] Yoshie manually checked the selected festival-stall segment for
      trademark logos and confirmed that it does not need a generic blur.
- [x] Yoshie approved the original music and the on-screen credit
      `Music: Templex Tsukino / KazeX Records`.
- [x] Yoshie approved the Kokoro-82M `af_heart` voice sample for local
      generation under Apache-2.0.
- [x] The Apple System Voice test was rejected and is excluded from the
      publishable workflow.

## Final English master after Kokoro regeneration

- [x] Duration is shorter than `3:00`; the verified container duration is
      exactly `2:30`.
- [x] English narration begins at `0:10` and remains audible through the final
      paragraph.
- [x] The generated narration explicitly says `GPT-5.6 Sol` and `Codex`.
- [x] The generated narration states that Yoshie did not write or edit
      application code.
- [x] Yoshie's creator and product-authority role remains clear; her silent
      review footage does not imply that she wrote code.
- [x] English captions match [`TELEPROMPTER.txt`](./TELEPROMPTER.txt) and the
      regenerated Kokoro narration.
- [x] No caption covers a control or important metric.
- [x] The product and local text evidence remain legible at normal playback.
- [ ] The only music is the approved original song, the voice remains clear,
      and `Music: Templex Tsukino / KazeX Records` is readable on screen.
- [x] Hospital footage establishes personal context only and does not imply a
      medical outcome or recommendation.
- [x] Every personal-footage derivative is approved by Yoshie and contains no
      avoidable third-party mark, copyrighted book cover, private screen,
      identifying label, QR code, or unapproved prominent likeness. The
      manually checked festival-stall signage does not require a blanket blur.
- [x] Internet-cafe, gym, and festival source audio is fully muted.
- [x] The submission MP4 is `1920 × 1080`, SDR Rec.709, constant `30 fps`,
      H.264 with AAC `48 kHz` stereo.
- [x] The submission MP4 contains no GPS, device information, cover art, lyrics,
      source-tool comments, or other inherited metadata.
- [ ] The final Kokoro narration uses the approved `af_heart` voice, does not
      imitate a third party, and has been re-listened to and approved by Yoshie.
- [x] Templex Tsukino's AI-generated persona is labeled on screen, remains
      clear of the English captions, and is disclosed in the description.
- [x] No personal calendar, notification, account detail, or private tab is
      visible.
- [x] The sample reports `0 min` overlapping time; the narration does not
      invent an overlap.
- [x] The room-making plan shortens `Go to the gym` by `30 min`, leaves
      `5:00–6:00 PM` open, and reports `18 allowed combinations`.
- [x] The video does not call snapshot import a live calendar-account
      integration.
- [x] The collaboration clip shows only local Markdown and local git history;
      no hosting-service page, third-party logo, remote URL, or branded window
      chrome is visible.
- [x] Avoidable third-party names are absent from narration and captions;
      submission-required GPT-5.6 and Codex references remain.
- [x] The video does not imply that AI runs in the app, reads event titles,
      edits a calendar, provides medical advice, or certifies accessibility.

Automated evidence for the local English candidate generated on July 20,
2026:

```text
File: Maybe-Tomorrow_Build-Week_FINAL_EN.mp4
SHA-256: 8b57a622f018422852589d13cb673e377685d122d58c716b4ea0bb2e0f6d2332
Container: 150.000 seconds
Video: 1920x1080, H.264, 4,500 frames, 30 fps, BT.709
Audio: AAC, 48 kHz stereo; -17.29 LUFS-I; -1.42 dBTP after AAC decode; 0 clipped samples
Narration: silence through 0:10; all seven sections end at least 1.00 seconds before their slots
Visual stream: byte-identical to Yoshie's approved review edit
Metadata: only ordinary MP4 container/stream handler tags; no location, device, author, date, artwork, lyric, or source comment
```

## Public YouTube upload

- [ ] YouTube Studio shows visibility **Public**, not Unlisted or Private.
- [ ] `{{YOUTUBE_URL}}` plays to the end in a signed-out/private browser.
- [ ] Title and description match [`YOUTUBE_METADATA.md`](./YOUTUBE_METADATA.md).
- [ ] If applicable, YouTube's altered/synthetic-content setting and the
      Kokoro narration disclosure accurately describe the final audio and
      visuals.
- [ ] Live app and repository links are clickable in the description.
- [ ] English captions are available and synchronized.
- [ ] Thumbnail is clear at small size.

The Japanese SRT is retained for a possible post-submission companion only; no
Japanese video is required for this checklist.

## Repository and live product

- [ ] The final submission PR received Yoshie or Templex review before merge.
- [ ] GitHub Pages deployment succeeded after merge.
- [x] Live home, core Quick Check, sample Today Map, and room-making path work.
- [ ] A keyboard/VoiceOver spot-check is recorded, or remaining assistive-
      technology coverage is left explicitly Pending without a certification
      claim.
- [x] Repository is public.
- [x] Root `LICENSE` is MIT with Yoshie Yamada's 2026 copyright notice.
- [x] `THIRD_PARTY_NOTICES.md` is present and does not relicense dependencies.
- [x] README names GPT-5.6, Templex Tsukino, and Codex contributions.
- [x] `npm test`, `npm run build`, `npm run verify:submission`, and
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
