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

## Issue #3 primary Anti-Planner demo

The current primary demo uses the bundled fictional calendar so it never
depends on a personal file or network access.

1. On the landing page, select **Try the overfull day**.
2. Explain that the ten fictional event titles are display text and that their
   flexibility labels came from a human, not a model.
3. Continue to the Today Map. Point out occupied time, the longest continuous
   opening, overlapping time, and protected recovery.
4. Select **Question one more addition**.
5. Enter `Draft another short story` and choose `1 hr`.
6. Complete Quick Check with values that produce **Maybe tomorrow.**:
   urgency `1`, commitment `0`, desire `4`, energy cost `3`, day load `4`,
   recovery need `3`, tomorrow flexibility `4`, shrinkable `Yes`.
7. Expand **The cost of yes** to show the exhaustive deterministic nearest
   alternatives.
8. Compare any Replacement Solver previews. Emphasize that fixed events and
   recovery are protected and that no source calendar is edited.
9. Choose a preview or leave the day unchanged, then save the decision locally.
10. Scroll to the Decision Journal and show the compact frozen day context.

The standalone scenarios above remain valid regression and secondary-demo
paths. The live demo should describe exact test counts only after running the
current suite.

— Codex

## Issue #5 refined demonstration order

The first viewport now presents the core decision before calendar context.

### 45–60 second core demo

1. Enter `Start another side project` in the hero input.
2. Select **Check one thing**.
3. Use Scenario A above to produce **Maybe tomorrow.**
4. Open **What would need to change?** and show that the alternatives are
   deterministic while the original answers stay unchanged.
5. Save the decision locally.

### 90–150 second expanded demo

1. Complete the first three core-demo steps so the product promise is clear.
2. Return home and select **Try the sample day**.
3. Review the pre-marked fictional events and select **See this day**.
4. Point out event time, longest opening, overlap, and protected recovery
   without presenting the day as graded.
5. Select **Check one thing**, enter `Draft another short story`, and choose
   `1 hr`.
6. Complete Quick Check with the existing Issue #3 answer values.
7. Open **What would need to change?** and **See what would have to move**.
8. Save the decision and optional room-making choice to the local journal.

The calendar path is optional evidence, not a more serious version of the
product.

— Codex
