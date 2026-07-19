# Demo Video Script

This is the canonical story and timing for the OpenAI Build Week demo. The
production files in [`video/`](./video/) turn it into an exact recording
procedure, answer key, teleprompter, and caption file.

## Locked format

- **Target runtime:** 2:30
- **Hard limit:** shorter than 3:00
- **Narration:** 283 words, approximately 2:28 at 115 words per minute
- **Platform:** public YouTube video
- **Audio:** English narration directed and approved by Yoshie Yamada; no
  music required
- **Captions:** burned-in or uploaded from [`CAPTIONS.srt`](./video/CAPTIONS.srt)
- **Capture:** deployed product plus local repository evidence; no browser
  developer tools and no personal calendar data

The final export should use clean cuts and ordinary-speed product interaction.
The product is the hero. The collaboration evidence explains how GPT-5.6 and
Codex made this particular build possible.

## Recommended title

**Maybe Tomorrow. — An Anti-Planner Built by a Novelist, GPT-5.6, and Codex**

## Timed story

### 0:00–0:19 — The problem and its origin

**Screen:** Begin with a silent shot of Yoshie at her computer, then use a
brief hospital portrait and hospital-room still before opening the deployed
home screen. The hospital footage establishes lived context only; it must not
imply a medical benefit.

**Narration:**

> Most productivity apps help us do more. My problem is the opposite. I’m
> Yoshie Yamada, a novelist and freelance writer. I can turn even a hospital
> room into a workspace. So I needed a brake: Maybe Tomorrow.

### 0:19–0:38 — Quick Check

**Screen:** Enter `Start another side project`, select **Check one thing**, and
complete all eight answers from [`ANSWER_KEYS.md`](./video/ANSWER_KEYS.md).
Use short clean cuts between questions while leaving each selected label
readable.

**Narration:**

> I name one activity and answer seven scored questions, plus a final check
> about making it smaller. The rules are fixed and transparent, with three
> verdicts—no generated advice or hidden confidence score.

### 0:38–0:56 — Verdict and Cost of Yes

**Screen:** Hold on **Maybe tomorrow.**, then open **What would need to
change?** and show the nearest alternative facts and `78,125 combinations`.

**Narration:**

> On an overfull day, another side project gets “Maybe tomorrow.” The app
> checks all 78,125 scored answer combinations and shows the smallest changes
> needed for another result, while leaving my original answers untouched.

### 0:56–1:20 — Optional calendar context

**Screen:** Return home, select **Try the sample day**, then **View this day**.
Show the fictional event labels and Today Map. Point to the four factual
metrics; do not claim that the sample contains overlaps.

**Narration:**

> Calendar context is optional. I can import an ICS file, a calendar export
> ZIP, or use a fictional sample. Everything stays in this browser. The app
> uses event times, but only I decide what must stay, what can move or shrink,
> what takes energy, and what protects recovery.

### 1:20–1:39 — One honest trade-off

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

### 1:39–2:01 — How GPT-5.6 and Codex were used

**Screen:** Begin with a silent over-shoulder shot of Yoshie reviewing the
finished product. Cut to tightly cropped local text evidence only:
signed local Markdown specifications, local `git log --oneline` history, and
the final `CODEX_WORKLOG.md` verification. Use a neutral local text renderer or
terminal and crop all window chrome. Do not record a hosting-service page,
logo, remote URL, or account interface.

**Narration:**

> I didn’t write or edit code. I shaped the product with my AI partner,
> Templex Tsukino, using GPT-5.6 Sol. Templex turned our conversations into
> signed specifications, rules, privacy boundaries, and review criteria. Codex
> implemented, tested, documented, and deployed the browser app.

### 2:01–2:30 — The life the product protects

**Screen:** Use short, sanitized cuts from the real build context: internet
cafe, gym with a computer, and Yoshie at a local summer festival. Every crop
must exclude third-party marks, copyrighted book covers, private screens, and
identifiable bystanders without permission. Mute all source audio. Return to
the product for the final privacy statement.

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
  every avoidable third-party mark, copyrighted work, private screen, and
  unapproved likeness.
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
