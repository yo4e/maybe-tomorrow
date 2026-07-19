# Demo Scenarios

Use these exact scenarios to verify scoring, capture screenshots, and record the hackathon demo.

## Scenario A: The signature demo

Activity:

> Start another side project

Answers:

| Question | Value | Label |
|---|---:|---|
| Urgency | 0 | Not urgent |
| Commitment | 0 | No |
| Genuine desire | 4 | Very much |
| Energy cost | 4 | A great deal |
| Day load | 4 | Overfull |
| Recovery need | 3 | Quite a lot |
| Tomorrow flexibility | 4 | Easily |
| Make it smaller? | Yes | Yes, probably |

Calculation:

- postponement pressure: `4 + 4 + 3 + 4 = 15`
- today necessity: `0 + 0 + (4 × 0.5) = 2`
- postpone score: `13`

Expected verdict:

> **Maybe tomorrow.**

Expected leading factors:

1. Today is already overfull.
2. This asks for energy today may not have.
3. This can easily wait until tomorrow.

This is the recommended main screenshot and video scenario.

## Scenario B: The reduced outing

Activity:

> Attend the festival

Answers:

| Question | Value | Label |
|---|---:|---|
| Urgency | 2 | Somewhat |
| Commitment | 0 | No |
| Genuine desire | 4 | Very much |
| Energy cost | 3 | A lot |
| Day load | 3 | Full |
| Recovery need | 2 | Some |
| Tomorrow flexibility | 1 | Probably not |
| Make it smaller? | Yes | Yes, probably |

Calculation:

- postponement pressure: `3 + 3 + 2 + 1 = 9`
- today necessity: `2 + 0 + (4 × 0.5) = 4`
- postpone score: `5`

Expected verdict:

> **Make it smaller.**

Expected interpretation:

> Keep the intention. Cut the time, distance, scope, or commitment.

This scenario demonstrates that the app does not simply say no to everything.

## Scenario C: The genuine obligation

Activity:

> Send the promised client draft

Answers:

| Question | Value | Label |
|---|---:|---|
| Urgency | 4 | Must happen today |
| Commitment | 4 | Strong commitment |
| Genuine desire | 1 | Not much |
| Energy cost | 3 | A lot |
| Day load | 4 | Overfull |
| Recovery need | 3 | Quite a lot |
| Tomorrow flexibility | 0 | No |
| Make it smaller? | Yes | Yes, probably |

Calculation:

- postponement pressure: `3 + 4 + 3 + 0 = 10`
- today necessity: `4 + 4 + (1 × 0.5) = 8.5`
- postpone score: `1.5`

Expected verdict:

> **Okay. One thing only.**

Expected leading factors:

1. This truly needs attention today.
2. You have made a strong commitment to someone else.
3. Today is already overfull, acknowledged in the supporting copy where appropriate.

This scenario demonstrates that the app can recognize necessity without becoming motivational.

## Scenario D: Guardrail A

Choose values that produce a base postpone score of at least 6 while `urgency === 4` and `commitment >= 3`.

Expected final verdict:

> **Make it smaller.**

The app must acknowledge both necessity and overload.

## Scenario E: Guardrail B

Choose values that would otherwise produce `proceed`, with:

- `urgency <= 1`;
- `commitment <= 1`;
- `tomorrowFlexibility >= 3`.

Expected final verdict:

> **Make it smaller.**

The app must not strongly approve a low-stakes activity that can easily wait.

## Scenario F: Guardrail C

Choose values that would otherwise produce `proceed`, with:

- `dayLoad === 4`;
- `recoveryNeed === 4`;
- `energyCost >= 3`.

Expected final verdict:

> **Make it smaller.**

The app must not approve a full-size high-energy activity on an extreme-overload day.

## Demo recording guidance

For the primary video:

1. begin on the landing page;
2. use Scenario A;
3. move through answers briskly without skipping the question text;
4. pause on the verdict and factors;
5. save the decision;
6. show local history;
7. show the future-integration note;
8. end before one minute.

Do not use browser developer tools, raw scores, or implementation details in the primary user-facing demo.

---

— Templex Tsukino

## Current recording scenarios

The deployed Issue #5 interface presents the standalone decision first and the
fictional calendar as optional context. Use the visible labels below when
recording Issue #6 assets. The original scenarios above remain useful scoring
references; in the current interface, the value `3` recovery label is
**A lot**.

### Core decision

1. Enter `Start another side project`.
2. Select **Check one thing**.
3. Use these exact visible answers, in order:

   | Question | Visible answer |
   |---|---|
   | Urgency | Not urgent |
   | Commitment | No |
   | Genuine desire | Very much |
   | Energy cost | A great deal |
   | Day load | Overfull |
   | Recovery need | A lot |
   | Tomorrow flexibility | Easily |
   | Make it smaller? | Yes, probably |

4. Pause on **Maybe tomorrow.** and its explanation.
5. Under **What would need to change?**, select **Show possible changes** to
   demonstrate that the fixed rules checked all `78,125` scored answer
   combinations while leaving the original answers unchanged.
6. Save the decision locally if the recording needs the Decision Journal.

### Optional sample-day context

1. Return home and select **Try the sample day**.
2. Review the pre-marked fictional events, then select **View this day**.
3. On the day view, show these exact facts without implying that the day is
   graded:

   - occupied: `11 hr 30 min`;
   - longest opening: `30 min`;
   - overlapping: `0 min`; and
   - protected recovery: `1 hr 15 min`.

4. Select **Check one thing**, enter `Draft another short story`, and choose
   `1 hr`.
5. Use these exact visible answers, in order:

   | Question | Visible answer |
   |---|---|
   | Urgency | Barely |
   | Commitment | No |
   | Genuine desire | Very much |
   | Energy cost | A lot |
   | Day load | Overfull |
   | Recovery need | A lot |
   | Tomorrow flexibility | Easily |
   | Make it smaller? | Yes, probably |

6. Pause on **Maybe tomorrow.** The **See what would have to move** section is
   already visible; it is not opened with a separate control.
7. Show the first room-making option: shorten `Go to the gym` by `30 min`,
   leaving `5:00–6:00 PM` open. The app checks `18` allowed combinations and
   protects events marked **Must stay** and **Protected recovery**.
8. Leave the day unchanged or save that option with the decision. Nothing edits
   the source calendar.

The sample day contains no overlapping time. It is optional evidence of local,
human-labelled calendar context, not a more serious version of the product.

— Codex
