# Demo Video Script

This is the canonical story and timing for the OpenAI Build Week demo. The
production files in [`video/`](./video/) turn it into an exact recording
procedure, answer key, teleprompter, and caption file.

## Locked format

- **Target runtime:** 2:30
- **Hard limit:** shorter than 3:00
- **Narration:** 283 words, approximately 2:28 at 115 words per minute
- **Platform:** public YouTube video
- **Audio:** Yoshie Yamada's English narration; no music required
- **Captions:** burned-in or uploaded from [`CAPTIONS.srt`](./video/CAPTIONS.srt)
- **Capture:** deployed product plus local repository evidence; no developer
  tools and no personal calendar data

The final export should use clean cuts and ordinary-speed product interaction.
The product is the hero. The collaboration evidence explains how GPT-5.6 and
Codex made this particular build possible.

## Recommended title

**Maybe Tomorrow. — An Anti-Planner Built by a Novelist, GPT-5.6, and Codex**

## Timed story

### 0:00–0:15 — The problem

**Screen:** Open the deployed home screen. Hold on `Does this really have to
happen today?`, the activity field, and **Check one thing**.

**Narration:**

> Most productivity apps help us do more. My problem is the opposite. I’m
> Yoshie Yamada, a novelist and freelance writer, and Maybe Tomorrow. asks
> whether one more worthwhile thing really belongs today.

### 0:15–0:35 — Quick Check

**Screen:** Enter `Start another side project`, select **Check one thing**, and
complete all eight answers from [`ANSWER_KEYS.md`](./video/ANSWER_KEYS.md).
Use short clean cuts between questions while leaving each selected label
readable.

**Narration:**

> I name one activity and answer seven scored questions, plus one final check
> about making it smaller. The rules are fixed and transparent, with only
> three possible verdicts—no generated advice and no hidden confidence score.

### 0:35–0:54 — Verdict and Cost of Yes

**Screen:** Hold on **Maybe tomorrow.**, then open **What would need to
change?** and show the nearest alternative facts and `78,125 combinations`.

**Narration:**

> On an overfull day, another side project gets “Maybe tomorrow.” The app
> checks all 78,125 scored answer combinations and shows the smallest facts
> that would have changed the result, without changing my answers.

### 0:54–1:20 — Optional calendar context

**Screen:** Return home, select **Try the sample day**, then **View this day**.
Show the fictional event labels and Today Map. Point to the four factual
metrics; do not claim that the sample contains overlaps.

**Narration:**

> Calendar context is optional. I can import an ICS file, a Google Calendar
> export ZIP, or use this fictional sample. Everything stays in this browser.
> The app reads time, but only I decide which events must stay, can move or
> shrink, take energy, or protect recovery.

### 1:20–1:39 — One honest trade-off

**Screen:** Select **Check one thing**, enter `Draft another short story`,
choose `1 hr`, and complete the sample answers. On the result, show the
automatic **See what would have to move** section: shortening `Go to the gym`
by 30 minutes leaves `5:00–6:00 PM` open after checking 18 allowed
combinations.

**Narration:**

> For one more hour of writing, it searches only changes I have authorized.
> Here, shortening the fictional gym creates a continuous hour. Fixed
> commitments and recovery stay protected, and the source calendar is never
> edited.

### 1:39–2:19 — How GPT-5.6 and Codex were used

**Screen:** Cut to tightly cropped, legible repository evidence: signed
specifications, the Issue #3 and #5 review loop, selected Codex commits and
Pull Request #4, and the final test/worklog record. Avoid unnecessary GitHub
branding or unrelated account information.

**Narration:**

> I did not manually write or edit the application code. I shaped the product
> with my AI partner, Templex Tsukino, using GPT-5.6 Sol. Templex turned our
> conversations into signed specifications, rules, copy, privacy boundaries,
> and review gates. Codex implemented, tested, documented, and deployed the
> React app. I directed part of the build from my phone at an internet cafe
> and a gym, then tested the product and approved the release.

### 2:19–2:30 — Closing boundary

**Screen:** Return to the product and end on the project name and browser-local
privacy statement.

**Narration:**

> Maybe Tomorrow. was built through AI collaboration, but it refuses to
> pretend AI understands your life. No AI reads your calendar. We can see the
> time. Only you know what it means.

## Recording truth boundaries

- The application uses no runtime AI, backend, account, analytics, or external
  API.
- An `.ics` file or Google Calendar export ZIP is a local snapshot, not a live
  Google Calendar integration.
- No AI reads or classifies event titles.
- The Today Map reports facts; it does not grade a day.
- Cost of Yes checks all 78,125 scored Quick Check combinations.
- Room-making previews are smallest changes only within the documented bounded
  search of changes the human has authorized.
- The sample has `0 min` overlapping time.
- A preview never edits the source calendar.
- Yoshie did not manually write or edit application code, but she remained the
  creator, product authority, first user, tester, and final approver.
- Do not claim a medical benefit, accessibility certification, autonomous AI
  agency, or one-prompt creation.

## Production files

- [`video/RECORDING_RUNBOOK.md`](./video/RECORDING_RUNBOOK.md)
- [`video/SHOT_LIST.md`](./video/SHOT_LIST.md)
- [`video/ANSWER_KEYS.md`](./video/ANSWER_KEYS.md)
- [`video/TELEPROMPTER.txt`](./video/TELEPROMPTER.txt)
- [`video/CAPTIONS.srt`](./video/CAPTIONS.srt)
- [`video/RESET_AND_FALLBACK.md`](./video/RESET_AND_FALLBACK.md)
- [`video/YOUTUBE_METADATA.md`](./video/YOUTUBE_METADATA.md)
- [`assets/storyboard.html`](./assets/storyboard.html)

— Codex
