# Video Production Kit

This directory contains the locked OpenAI Build Week demo package for
**Maybe Tomorrow.** It is designed so the remaining work is performance and
editing, not reconstruction of the product story.

## Locked output

- Target length: `2:30`
- Hard limit: shorter than `3:00`
- Narration: `283` words, approximately `2:28` at 115 words per minute
- Video visibility: **Public** on YouTube, not Private or Unlisted
- Audio: English voiceover generated locally with Kokoro-82M's `af_heart`
  voice under Apache-2.0, directed by Yoshie Yamada, technically verified, and
  pending complete-file listening approval; with an approved original song by
  Templex Tsukino / KazeX Records
- Submission master: one English-captioned MP4; the rejected Apple System
  Voice test is not publishable
- Data: bundled fictional sample only
- Runtime claims: no AI, backend, external API, account, sync, or writeback

## Use these files in order

1. [`RECORDING_RUNBOOK.md`](./RECORDING_RUNBOOK.md) — prepare and record from a
   clean state.
2. [`ANSWER_KEYS.md`](./ANSWER_KEYS.md) — select the exact visible UI labels.
3. [`SHOT_LIST.md`](./SHOT_LIST.md) — assemble the eight timed story sections
   to the locked timeline.
4. [`TELEPROMPTER.txt`](./TELEPROMPTER.txt) — record only this narration.
5. [`CAPTIONS.srt`](./CAPTIONS.srt) — burn in the required English captions.
   [`CAPTIONS.ja.srt`](./CAPTIONS.ja.srt) remains available only for an
   optional post-submission companion.
6. [`RESET_AND_FALLBACK.md`](./RESET_AND_FALLBACK.md) — recover without using
   personal data if a take fails.
7. [`YOUTUBE_METADATA.md`](./YOUTUBE_METADATA.md) — paste the final title and
   description.
8. [`DEVPOST_FINAL.md`](./DEVPOST_FINAL.md) — paste the project submission copy.
9. [`MANUAL_STEPS.md`](./MANUAL_STEPS.md) — complete only the human-required
   actions.
10. [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) — verify the export and public links
    before submitting.

The final screenshots, thumbnails, and contact sheet live in
[`../assets/`](../assets/).

## Recording principle

Keep all personal and product-source audio muted. Regenerate the English
narration locally with Kokoro-82M's `af_heart` voice, under Apache-2.0, in the
seven paragraph-sized segments. Yoshie approved the voice sample, and the
complete regenerated file passed technical QA; complete-file listening
approval remains. Do not use the rejected Apple System Voice version. Disclose synthetic narration
truthfully in the upload workflow and description. Let the approved original
song lead the first ten seconds, then duck it deeply under the voice. Assemble
with clean cuts and no sped-up unreadable UI.

— Codex
