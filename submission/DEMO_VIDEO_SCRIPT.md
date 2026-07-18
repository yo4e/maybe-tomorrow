# Demo Video Script

## Format

- **Target runtime:** 2:25–2:45
- **Hard limit:** under 3:00
- **Platform:** public YouTube video
- **Language:** English narration; burned-in English captions recommended
- **Style:** direct screen recording with clean cuts, no copyrighted music, no developer tools
- **Required content:** show the working product and audibly explain how both Codex and GPT-5.6 were used

The product should remain the hero. The collaboration story should explain why this particular product could be built by this particular team, not become a generic AI testimonial.

## Recommended title

**Maybe Tomorrow. — An Anti-Planner Built by a Novelist, GPT-5.6, and Codex**

## Full timed script

### 0:00–0:14 — The problem

**Screen**

Open the deployed landing page. Hold briefly on:

- `You do not need help doing more.`
- the activity field;
- `Check one thing`.

**Narration**

> Most productivity apps help us do more. I built Maybe Tomorrow. because my problem is the opposite. I’m Yoshie Yamada, a novelist and freelance writer, and this app asks whether one more worthwhile thing truly belongs today.

### 0:14–0:43 — Quick Check

**Screen**

Enter:

```text
Start another side project
```

Select **Check one thing** and answer the eight prompts briskly. Use the exact values in the answer sheet below. Do not hide the questions completely; use clean cuts between answers if necessary.

**Narration**

> Quick Check uses eight explicit answers about urgency, commitment, desire, energy, the day’s load, recovery, tomorrow, and whether the idea can shrink. It applies deterministic rules and returns exactly three possible verdicts. There is no generated advice and no hidden confidence score.

### 0:43–1:02 — Verdict and Cost of Yes

**Screen**

Pause on:

```text
Maybe tomorrow.
```

Show the leading factors. Open **What would need to change?** and reveal the nearest alternative facts.

**Narration**

> For another side project on an overfull day, the answer is “Maybe tomorrow.” The optional Cost of Yes does not rewrite my answers. It exhaustively checks all 78,125 scored combinations and shows how much reality would have to change before another verdict became honest.

### 1:02–1:29 — Optional calendar context

**Screen**

Return home and select **Try the sample day**. Move through the pre-labelled fictional events and open the Today Map. Point visually to:

- the chronological day;
- an overlap;
- protected recovery;
- the longest continuous opening.

**Narration**

> Calendar context is optional. The app can read an ICS file or a Google Calendar export ZIP entirely inside the browser, or use this fictional sample. Event meaning is never guessed from titles. Only the human marks what is fixed, movable, reducible, high-energy, or recovery.

### 1:29–1:48 — The hidden cost of one more thing

**Screen**

Select **Check one thing** from the sample day. Enter:

```text
Draft another short story
```

Choose `1 hr`, complete the prepared answers, then open **See what would have to move**. Show one preview without applying an edit.

**Narration**

> When I add one more hour, Maybe Tomorrow. searches only the changes I authorized. Fixed commitments and recovery stay protected. It can preview what would have to leave or shrink, but it never edits the source calendar.

### 1:48–2:28 — How it was built

**Screen**

Cut to the GitHub repository. Show, in this order:

1. the signed specification documents in `docs/`;
2. the commit history with Templex and Codex commit messages;
3. Issue #3’s Templex approval and Codex implementation report;
4. Issue #5’s Yoshie feedback, Templex review gate, and Codex refinement;
5. `CODEX_WORKLOG.md` or the test count.

**Narration**

> I am not a software engineer, and I did not manually write or edit the application code. I developed the idea with my long-term AI partner, Templex Tsukino, in ChatGPT using GPT-5.6 Sol. Templex turned our conversations into signed product specifications, scoring rules, UX copy, design direction, privacy boundaries, and review decisions in the repository.
>
> While I was away from my computer at an internet cafe and a gym, I used a smartphone connected to Codex to keep directing the work. Codex implemented, tested, documented, and deployed the application. Templex reviewed Codex’s proposals and reports through GitHub issues and pull requests. I returned home to use the product, identify problems in hierarchy, English, and visual identity, and approve the final version.

### 2:28–2:42 — Closing thesis

**Screen**

Return to the product. Hold on the privacy statement or final verdict. End on the project name.

**Narration**

> Maybe Tomorrow. is not an AI app that reads your life. It is software built through a documented human–AI–AI collaboration and designed to know its limits. No AI reads your calendar. We can see the time. Only you know what it means.

## Exact Quick Check answer sheet

Use these values for `Start another side project`:

| Prompt | Answer |
|---|---|
| Urgency | Not urgent — 0 |
| Commitment | No — 0 |
| Genuine desire | Very much — 4 |
| Energy cost | A great deal — 4 |
| Day load | Overfull — 4 |
| Recovery need | Quite a lot — 3 |
| Tomorrow flexibility | Easily — 4 |
| Could it be made smaller? | Yes, probably |

Expected verdict:

```text
Maybe tomorrow.
```

## Exact sample-day answer sheet

Use these values for `Draft another short story`, duration `1 hr`:

| Prompt | Answer value |
|---|---:|
| Urgency | 1 |
| Commitment | 0 |
| Genuine desire | 4 |
| Energy cost | 3 |
| Day load | 4 |
| Recovery need | 3 |
| Tomorrow flexibility | 4 |
| Could it be made smaller? | Yes |

Expected behavior:

- verdict: **Maybe tomorrow.**
- Cost of Yes is available;
- at least one room-making preview is available in the bundled sample;
- Fixed and Recovery events are not offered as changes;
- the imported or fictional calendar is not mutated.

## Recording notes

- Record the complete interactions first, then edit out cursor travel and loading pauses.
- Keep the product at normal speed. Use cuts rather than extreme speed-up when questions must remain readable.
- Record the GitHub evidence as a separate clip so repository text can be zoomed cleanly.
- Keep personal calendar data out of the video; use the bundled fictional day.
- Display the live URL and repository URL in the final frame or YouTube description.
- Do not say the application uses GPT-5.6 at runtime.
- Do not call the local file path “Google Calendar integration.”
- Do not claim the app prevents illness or provides medical advice.
- Verify that the final upload is publicly visible while signed out of YouTube.

## Suggested YouTube description

```text
Maybe Tomorrow. is a local-first anti-planner for people who need help doing one less thing.

Created by novelist and freelance writer Yoshie Yamada through a documented collaboration with her AI partner Templex Tsukino in ChatGPT using GPT-5.6 Sol, and implemented, tested, and deployed with Codex for OpenAI Build Week.

Live app: https://yo4e.github.io/maybe-tomorrow/
Source and build record: https://github.com/yo4e/maybe-tomorrow

The application uses no runtime AI, backend, account, analytics, or external API. Calendar snapshots are processed only in the current browser tab.
```

## Thumbnail copy

```text
TOO MOTIVATED?
MAYBE TOMORROW.
```
