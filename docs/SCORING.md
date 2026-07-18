# Scoring Specification

## 1. Purpose

The scoring system exists to make the app predictable, explainable, and testable without runtime AI.

It is not a medical, psychological, or safety assessment. It does not know the user’s full context. It simply compares reasons to act today with reasons to postpone.

## 2. Inputs

All seven primary inputs are integers from 0 to 4.

```ts
type DecisionInputs = {
  urgency: 0 | 1 | 2 | 3 | 4;
  commitment: 0 | 1 | 2 | 3 | 4;
  desire: 0 | 1 | 2 | 3 | 4;
  energyCost: 0 | 1 | 2 | 3 | 4;
  dayLoad: 0 | 1 | 2 | 3 | 4;
  recoveryNeed: 0 | 1 | 2 | 3 | 4;
  tomorrowFlexibility: 0 | 1 | 2 | 3 | 4;
  shrinkable: boolean;
};
```

## 3. Formula

Calculate two transparent components.

```ts
const postponementPressure =
  energyCost +
  dayLoad +
  recoveryNeed +
  tomorrowFlexibility;

const todayNecessity =
  urgency +
  commitment +
  desire * 0.5;

const postponeScore = postponementPressure - todayNecessity;
```

Possible score range:

- minimum: `-10`
- maximum: `16`

Do not round the score before verdict selection. A half-point is valid because desire has half weight.

### Why desire has half weight

Wanting something matters, but this product is designed for people who genuinely want to do too many things. Desire should influence the decision without overpowering overload, recovery, urgency, or responsibility.

## 4. Verdict thresholds

```ts
if (postponeScore >= 6) {
  verdict = "postpone";
} else if (postponeScore >= 2) {
  verdict = "reduce";
} else {
  verdict = "proceed";
}
```

Verdict labels:

| Internal value | Display label |
|---|---|
| `postpone` | Maybe tomorrow. |
| `reduce` | Make it smaller. |
| `proceed` | Okay. One thing only. |

## 5. Guardrails

Apply these deterministic guardrails after calculating the base score.

### Guardrail A: hard urgency and commitment

If both `urgency === 4` and `commitment >= 3`, the verdict cannot be `postpone`.

- If base verdict is `postpone`, change it to `reduce`.
- Explanation should acknowledge that the activity may be necessary while the day is overloaded.

### Guardrail B: no urgency, no commitment, high flexibility

If `urgency <= 1`, `commitment <= 1`, and `tomorrowFlexibility >= 3`, the verdict cannot be `proceed`.

- If base verdict is `proceed`, change it to `reduce`.

### Guardrail C: extreme overload

If `dayLoad === 4`, `recoveryNeed === 4`, and `energyCost >= 3`, the verdict cannot be `proceed`.

- If base verdict is `proceed`, change it to `reduce`.

Do not add further hidden exceptions without updating this document and the tests.

## 6. Explanation-factor selection

The result screen shows up to three factors.

Represent each factor as a signed contribution.

Positive contributions push toward postponement:

| Factor | Contribution |
|---|---:|
| energy cost | `energyCost` |
| day load | `dayLoad` |
| recovery need | `recoveryNeed` |
| tomorrow flexibility | `tomorrowFlexibility` |

Negative contributions push toward acting today:

| Factor | Contribution magnitude |
|---|---:|
| urgency | `urgency` |
| commitment | `commitment` |
| desire | `desire * 0.5` |

### Selection rules

- For `postpone`, select the three largest positive contributions with value at least 2.
- For `proceed`, select the three largest negative-contribution magnitudes with value at least 2.
- For `reduce`, select up to two largest positive contributions and one largest negative contribution, each at least 2.
- If fewer than two qualifying factors exist, include the strongest remaining factors.
- Resolve ties in this stable order:
  1. day load
  2. recovery need
  3. energy cost
  4. tomorrow flexibility
  5. urgency
  6. commitment
  7. desire

The UI displays factor sentences from `docs/UX_COPY.md`.

## 7. Reduced-action suggestion

The `shrinkable` answer does not alter the score.

For a `reduce` verdict:

- if `shrinkable === true`, show: `Keep the intention. Cut the time, distance, scope, or commitment.`
- if `shrinkable === false`, show: `If it cannot be made smaller, decide what it replaces.`

For `postpone` and `proceed`, the answer may be stored but does not change the primary copy.

## 8. Required unit tests

At minimum, test:

1. score exactly `6` returns `postpone`;
2. score exactly `2` returns `reduce`;
3. score below `2` returns `proceed`;
4. half-point desire calculations are preserved;
5. Guardrail A converts `postpone` to `reduce`;
6. Guardrail B converts `proceed` to `reduce`;
7. Guardrail C converts `proceed` to `reduce`;
8. factor selection is stable under ties;
9. representative gym scenario returns `postpone`;
10. representative deadline scenario returns `proceed` or `reduce`, never `postpone` when Guardrail A applies;
11. representative fun-but-crowded outing returns `reduce` or `postpone` depending on overload;
12. malformed values are rejected or normalized before scoring.

## 9. Representative scenarios

### Optional gym visit on an overfull recovery day

```ts
{
  urgency: 0,
  commitment: 0,
  desire: 3,
  energyCost: 3,
  dayLoad: 4,
  recoveryNeed: 4,
  tomorrowFlexibility: 4,
  shrinkable: true
}
```

Expected: `postpone`.

### Client deadline with another person depending on delivery

```ts
{
  urgency: 4,
  commitment: 4,
  desire: 1,
  energyCost: 3,
  dayLoad: 4,
  recoveryNeed: 3,
  tomorrowFlexibility: 0,
  shrinkable: true
}
```

Expected: `proceed` or `reduce` according to the formula; never `postpone` because of Guardrail A.

### Appealing event that can happen another day

```ts
{
  urgency: 1,
  commitment: 0,
  desire: 4,
  energyCost: 3,
  dayLoad: 3,
  recoveryNeed: 2,
  tomorrowFlexibility: 4,
  shrinkable: true
}
```

Expected: `postpone`.

## 10. Displaying the score

Do not show the raw score by default. It creates false precision and distracts from the decision.

A small expandable “How this works” section may show the formula in plain language:

> We compare urgency, responsibility, and genuine desire with energy cost, today’s load, recovery need, and whether the activity can wait.

Do not show percentages or confidence levels.

---

— Templex Tsukino