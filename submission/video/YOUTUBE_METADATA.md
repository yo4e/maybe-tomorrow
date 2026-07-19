# YouTube Metadata

## Title

English-captioned Build Week entry:

```text
Maybe Tomorrow. — An Anti-Planner Built by a Novelist, GPT-5.6, and Codex
```

Japanese-captioned companion:

```text
Maybe Tomorrow. — Build Week Demo with Japanese Captions
```

## Description

```text
Maybe Tomorrow. is a local-first anti-planner for people who need help doing one less thing.

Created for OpenAI Build Week by novelist and freelance writer Yoshie Yamada through a documented collaboration with her AI partner Templex Tsukino in ChatGPT using GPT-5.6 Sol, and implemented, tested, documented, and deployed with Codex.

English narration uses a synthetic voice under Yoshie Yamada's direction and final approval.
Music: Templex Tsukino / KazeX Records. Used with the rights holder's permission.
Visual disclosure: Templex Tsukino is an AI persona represented by AI-generated imagery.

Live app: https://yo4e.github.io/maybe-tomorrow/
Source, specifications, and build record: https://github.com/yo4e/maybe-tomorrow
Build Week project: {{DEVPOST_URL}}

The application uses no runtime AI, backend, account, analytics, or external API. Optional ICS and calendar export ZIP snapshots are processed only in the current browser tab. No AI reads or classifies event titles, and the app never edits a source calendar.

License: MIT for project code and documentation. Third-party components remain under their respective licenses; see the repository notices.
```

Delete the `Build Week project` line until `{{DEVPOST_URL}}` is known. After
submission, add the public Devpost URL and save the YouTube description.
Delete the synthetic-voice sentence only if the final export instead uses
Yoshie's own recorded English voice.

For the Japanese-captioned companion, add this sentence after the first
paragraph:

```text
This companion edition keeps the original English interface and narration and adds burned-in Japanese captions.
```

## Optional tags

```text
OpenAI Build Week, Codex, GPT-5.6, anti-productivity, local-first, accessibility, calendar privacy
```

Tags are optional and should not delay publication.

## Thumbnail

Use [`../assets/youtube-thumbnail.png`](../assets/youtube-thumbnail.png).

Visible copy:

```text
TOO MOTIVATED?
MAYBE TOMORROW.
```

## Upload settings

- Visibility: **Public**
- Audience: choose the accurate setting; the project is not directed to
  children
- Captions: the English upload uses [`CAPTIONS.srt`](./CAPTIONS.srt); the
  Japanese-captioned companion uses [`CAPTIONS.ja.srt`](./CAPTIONS.ja.srt).
  Keep the matching English track available on both uploads when practical.
- Music: original music credited on screen and in the description as
  `Templex Tsukino / KazeX Records`; Yoshie confirmed the required rights
- Altered/synthetic content: answer the upload question truthfully. If the
  final export uses a realistic synthetic dub or any other meaningfully
  synthetic media, select the applicable disclosure.
- Paid promotion: none, unless Yoshie independently knows otherwise
- License: YouTube Standard License is acceptable for the video; this does not
  change the repository's MIT license

After upload, verify both YouTube Studio's visibility label and playback in a
signed-out/private browser. A signed-out video that does not play is not ready
for Devpost.

Final public video URL:

```text
{{YOUTUBE_URL}}
```

— Codex
