# Demo Video Script

This is the canonical story and timing for the OpenAI Build Week demo. The
production files in [`video/`](./video/) turn it into an exact recording
procedure, answer key, teleprompter, and caption file.

## Locked format

- **Target runtime:** 2:30
- **Hard limit:** shorter than 3:00
- **Narration:** 283 words, beginning at `0:10` and ending before `2:30`
- **Platform:** public YouTube video
- **Audio:** English narration generated locally with Kokoro-82M's `af_heart`
  voice under Apache-2.0, directed by Yoshie Yamada and approved after her
  complete-file playback on July 20, 2026; plus original music credited to
  Templex Tsukino / KazeX Records and used with the rights holder's permission.
  The rejected Apple System Voice test must not be published.
- **Captions:** burned-in English from [`CAPTIONS.srt`](./video/CAPTIONS.srt).
  [`CAPTIONS.ja.srt`](./video/CAPTIONS.ja.srt) is retained only for a possible
  post-submission companion and is not required for the Build Week entry.
- **Capture:** deployed product plus local repository evidence; no browser
  developer tools and no personal calendar data

The final export should use clean cuts and ordinary-speed product interaction.
The product is the hero. The collaboration evidence explains how GPT-5.6 and
Codex made this particular build possible.

## Recommended title

**Maybe Tomorrow. — An Anti-Planner Built by a Novelist, GPT-5.6, and Codex**

## Timed story

### 0:00–0:10 — Music, title, and creator

**Screen:** Use Yoshie's silent computer footage in gentle slow motion without
an opening title card. Show only the small credit
`Music: Templex Tsukino / KazeX Records` without covering Yoshie or the
computer.

**Audio:** Let the original song establish the opening. Narration begins at
`0:10`; after that point the song remains deeply ducked beneath the voice.

### 0:10–0:28 — The problem and its origin

**Screen:** Use a brief hospital portrait and a sanitized hospital-workspace
still before opening the clean product home screen. The hospital footage
establishes lived context only; it must not imply a medical benefit.

**Narration:**

> Most productivity apps help us do more. My problem is the opposite. I’m
> Yoshie Yamada, a novelist and freelance writer. I can turn even a hospital
> room into a workspace. So I needed a brake: Maybe Tomorrow.

### 0:28–0:44 — Quick Check

**Screen:** Enter `Start another side project`, select **Check one thing**, and
complete all eight answers from [`ANSWER_KEYS.md`](./video/ANSWER_KEYS.md).
Use short clean cuts between questions while leaving each selected label
readable.

**Narration:**

> I name one activity and answer seven scored questions, plus a final check
> about making it smaller. The rules are fixed and transparent, with three
> verdicts—no generated advice or hidden confidence score.

### 0:44–1:02 — Verdict and Cost of Yes

**Screen:** Hold on **Maybe tomorrow.**, then open **What would need to
change?** and show the nearest alternative facts and `78,125 combinations`.

**Narration:**

> On an overfull day, another side project gets “Maybe tomorrow.” The app
> checks all 78,125 scored answer combinations and shows the smallest changes
> needed for another result, while leaving my original answers untouched.

### 1:02–1:26 — Optional calendar context

**Screen:** Return home, select **Try the sample day**, then **View this day**.
Show the fictional event labels and Today Map. Point to the four factual
metrics; do not claim that the sample contains overlaps.

**Narration:**

> Calendar context is optional. I can import an ICS file, a calendar export
> ZIP, or use a fictional sample. Everything stays in this browser. The app
> uses event times, but only I decide what must stay, what can move or shrink,
> what takes energy, and what protects recovery.

### 1:26–1:44 — One honest trade-off

**Screen:** Select **Check one thing**, enter `Draft another short story`,
choose `1 hr`, and complete the sample answers. On the result, show the
automatic **See what would have to move** section: shortening `Go to the gym`
by 30 minutes leaves `5:00–6:00 PM` open after checking 18 allowed
combinations.

**Narration:**

> For one more hour of writing, it considers only changes I have allowed.
> Here, shortening the fictional gym visit creates a continuous hour. Fixed
> commitments and recovery stay protected, and the source calendar is never
> edited.

### 1:44–2:07 — How GPT-5.6 and Codex were used

**Screen:** Begin with Yoshie's silent close review of the finished product.
Show Templex Tsukino's disclosed AI-generated persona, tightly cropped signed
local Markdown evidence, a brief Codex visual, local git history, and the
local verification summary. Do not show a hosting-service page, remote URL, account interface, or
unrelated project data. Keep `AI-generated persona` visible during Templex's
appearance.

**Narration:**

> I didn’t write or edit code. I shaped the product with my AI partner,
> Templex Tsukino, using GPT-5.6 Sol. Templex turned our conversations into
> signed specifications, rules, privacy boundaries, and review criteria. Codex
> implemented, tested, documented, and deployed the browser app.

### 2:07–2:30 — The life the product protects

**Screen:** Use short, sanitized cuts from the real build context: internet
cafe, gym with a computer, and Yoshie at a local summer festival. Use Yoshie's
approved crops. The festival stalls have been checked for trademark logos and
do not need a generic blur. Continue to crop avoidable third-party marks,
copyrighted book covers, private screens, and unapproved prominent likenesses.
Mute all source audio. Return to the product for the final privacy statement.

**Narration:**

> I directed part of the build from my phone at an internet cafe and a gym.
> Codex completed release work while I enjoyed the festival. That wasn’t lost
> productivity. It was the point. Maybe Tomorrow. was built with AI, but no AI
> reads your calendar. We can see the time. Only you know what it means.

## Recording truth boundaries

- The application uses no runtime AI, backend, account, analytics, or external
  API.
- An `.ics` file or calendar export ZIP is a local snapshot, not a live
  calendar-account integration.
- No AI reads or classifies event titles.
- The Today Map reports facts; it does not grade a day.
- Cost of Yes checks all 78,125 scored Quick Check combinations.
- Room-making previews are smallest changes only within the documented bounded
  search of changes the human has authorized.
- The sample has `0 min` overlapping time.
- A preview never edits the source calendar.
- Yoshie did not manually write or edit application code, but she remained the
  creator, product authority, first user, tester, and final approver.
- Hospital imagery documents Yoshie's tendency to keep working; it does not
  make or imply a health claim.
- Real-life footage must be used only with Yoshie's approval and after removing
  avoidable third-party marks, copyrighted works, private screens, and
  unapproved prominent likenesses. Yoshie's manual check found no trademark
  logo in the selected festival-stall segment, so it does not require a blanket
  blur.
- The original song may be used only under Yoshie's confirmed rights. The
  final file must carry the on-screen music credit and must not inherit cover
  art, lyrics, location, device, or source-tool metadata.
- Do not claim a medical benefit, accessibility certification, autonomous AI
  agency, or one-prompt creation.

## Production files

- [`video/RECORDING_RUNBOOK.md`](./video/RECORDING_RUNBOOK.md)
- [`video/SHOT_LIST.md`](./video/SHOT_LIST.md)
- [`video/ANSWER_KEYS.md`](./video/ANSWER_KEYS.md)
- [`video/TELEPROMPTER.txt`](./video/TELEPROMPTER.txt)
- [`video/CAPTIONS.srt`](./video/CAPTIONS.srt)
- [`video/CAPTIONS.ja.srt`](./video/CAPTIONS.ja.srt) — optional future
  post-submission companion only
- [`video/RESET_AND_FALLBACK.md`](./video/RESET_AND_FALLBACK.md)
- [`video/YOUTUBE_METADATA.md`](./video/YOUTUBE_METADATA.md)
- [`assets/storyboard.html`](./assets/storyboard.html)

— Codex
