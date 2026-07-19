# Human-Only Submission Steps

Everything below requires Yoshie Yamada's likeness, account, legal
confirmation, rights confirmation, or final product authority. Codex must not
guess or publish these values.

## Already confirmed by Yoshie

- The complete visual edit and personal-footage crops are approved.
- The selected festival-stall segment has been checked for trademark logos and
  does not need a generic blur.
- The original song may be used in the public competition video and on
  YouTube, with the credit `Templex Tsukino / KazeX Records`.
- The Kokoro-82M `af_heart` voice sample is approved for the final local
  regeneration under Apache-2.0.
- The Apple System Voice test is rejected and must not be published.
- Codex rendered the complete Kokoro-narrated English candidate and passed its
  technical, timing, loudness, clipping, stream, metadata, and visual-stream
  identity checks.

## Before publication

1. Listen to and approve the regenerated English narration from beginning to
   end,
   including pronunciation, pace, and Japanese meaning.
2. Review the final English master after the narration replacement and confirm
   that no avoidable third-party mark, copyrighted book cover, private screen,
   identifying label, or unapproved prominent likeness is visible.
3. Confirm <https://yo4e.github.io/maybe-tomorrow/> still loads and shows the
   new favicon.

## Record and publish the video

1. Follow [`RECORDING_RUNBOOK.md`](./RECORDING_RUNBOOK.md).
2. Approve the final Kokoro English narration from
   [`TELEPROMPTER.txt`](./TELEPROMPTER.txt), including pronunciation and pace.
3. Add the prepared Kokoro synthetic-voice disclosure and answer YouTube's
   synthetic-content upload question truthfully.
4. Review the complete edit with headphones and request any corrections.
5. Export the English-only submission master and complete
   [`QA_CHECKLIST.md`](./QA_CHECKLIST.md).
6. Upload with [`YOUTUBE_METADATA.md`](./YOUTUBE_METADATA.md).
7. Set the video to **Public**, then confirm signed-out playback.
8. Copy the final URL as `{{YOUTUBE_URL}}`.

An optional Japanese-captioned companion may be made after submission if time
and resources remain. It is not required for the Build Week entry.

## Recommended accessibility spot-check

Automated evidence is recorded in
[`../../docs/ACCESSIBILITY_AUDIT.md`](../../docs/ACCESSIBILITY_AUDIT.md), but it
is not a screen-reader test or certification. Before submission, if practical:

1. use the keyboard alone to complete the core Quick Check;
2. turn on macOS VoiceOver and confirm the question legend, selected answer,
   verdict, Today Map text order, and room-making option are understandable;
3. save and delete one fictional decision and confirm focus does not disappear;
4. record the browser, VoiceOver version, and result in the audit matrix; and
5. leave every untested platform marked **Pending** rather than generalizing
   from one device.

This spot-check is recommended product QA, not a reason to claim WCAG
certification in Devpost.

## Obtain the Codex Session ID

1. Return to the primary Codex task where most of the application's core
   functionality was built—this task, not a new one.
2. Enter `/feedback` and complete the feedback flow.
3. Copy the Session ID shown by Codex.
4. Paste it directly into the Devpost form as `{{FEEDBACK_SESSION_ID}}`.
5. Do **not** commit the real Session ID to this public repository, a GitHub
   issue, a pull request, or the YouTube description.

## Complete Devpost

1. Join the challenge at <https://openai.devpost.com/> with Yoshie's account.
2. Confirm personal eligibility, team/participant details, rights to the
   submitted materials, and acceptance of the official rules. These are human
   legal statements.
3. Select the **Apps for Your Life** track.
4. Paste the matching sections from [`DEVPOST_FINAL.md`](./DEVPOST_FINAL.md).
5. Add:
   - live app: <https://yo4e.github.io/maybe-tomorrow/>;
   - repository: <https://github.com/yo4e/maybe-tomorrow>;
   - public YouTube video: `{{YOUTUBE_URL}}`; and
   - Codex feedback Session ID: `{{FEEDBACK_SESSION_ID}}`.
6. Upload the prepared assets from [`../assets/`](../assets/).
7. Inspect the live form for any required field that is only visible after
   joining. The public rules do not expose every account-specific form field.
8. Preview the submission and remove every unresolved placeholder.
9. Submit before **July 21, 2026 at 5:00 PM PDT**, which is **July 22, 2026 at
   9:00 AM JST**.
10. Copy the public project URL as `{{DEVPOST_URL}}` and add it to the YouTube
    description after submission.

## Keep available for judging

Keep the app, public repository, and public video free and accessible through
the judging and winner-announcement period. Do not rename or delete their URLs
while judging is active.

— Codex
