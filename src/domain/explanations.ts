import type { DecisionInputs, FactorKey, ScoreValue, Verdict } from "./types";

const FACTOR_COPY: Record<FactorKey, Partial<Record<ScoreValue, string>>> = {
  dayLoad: {
    2: "Today is not empty.",
    3: "Today is already full.",
    4: "Today is already overfull.",
  },
  recoveryNeed: {
    2: "Some recovery would be useful.",
    3: "You need meaningful recovery today.",
    4: "Recovery is already one of today’s jobs.",
  },
  energyCost: {
    2: "This will take noticeable energy.",
    3: "This will take a lot of energy.",
    4: "This asks for energy today may not have.",
  },
  tomorrowFlexibility: {
    2: "This may be able to wait.",
    3: "This can probably wait until tomorrow.",
    4: "This can easily wait until tomorrow.",
  },
  urgency: {
    2: "There is some real urgency.",
    3: "This is genuinely urgent.",
    4: "This truly needs attention today.",
  },
  commitment: {
    2: "Someone else is somewhat affected.",
    3: "Someone else is depending on you.",
    4: "You have made a strong commitment to someone else.",
  },
  desire: {
    2: "You are not indifferent to this.",
    3: "You genuinely want to do this.",
    4: "You genuinely want this — which is exactly why the decision is difficult.",
  },
};

const FALLBACK_COPY: Record<FactorKey, string> = {
  dayLoad: "Today’s existing load matters here.",
  recoveryNeed: "Your need for recovery matters here.",
  energyCost: "The energy this requires matters here.",
  tomorrowFlexibility: "Whether this can wait matters here.",
  urgency: "The level of urgency matters here.",
  commitment: "Your responsibility to someone else matters here.",
  desire: "Your genuine desire matters here.",
};

export const VERDICT_COPY: Record<
  Verdict,
  {
    eyebrow: string;
    heading: string;
    historyLabel: string;
    statement: (activity: string) => string;
    body: string;
    saved: string;
  }
> = {
  postpone: {
    eyebrow: "TODAY’S DECISION",
    heading: "Maybe tomorrow.",
    historyLabel: "Maybe tomorrow.",
    statement: (activity) => `${activity} does not need another piece of today.`,
    body: "Postponing this is a decision, not a failure. You are not abandoning it. You are refusing to make today carry everything.",
    saved: "Officially not happening today.",
  },
  reduce: {
    eyebrow: "TODAY’S DECISION",
    heading: "Make it smaller.",
    historyLabel: "Made smaller.",
    statement: (activity) =>
      `${activity} may matter, but the full-size version does not own today.`,
    body: "A reduced version can keep the intention without asking today to absorb the whole thing.",
    saved: "The smaller version has been approved.",
  },
  proceed: {
    eyebrow: "LIMITED PERMISSION",
    heading: "Okay. One thing only.",
    historyLabel: "One thing only.",
    statement: (activity) => `${activity} may need to happen today.`,
    body: "Do it, then stop adding things. This verdict is not permission to rebuild the entire schedule.",
    saved: "Approved. One thing. We saw you.",
  },
};

export function getFactorSentence(
  key: FactorKey,
  inputs: DecisionInputs,
): string {
  const value = inputs[key];
  return FACTOR_COPY[key][value] ?? FALLBACK_COPY[key];
}

export function getReduceSuggestion(shrinkable: boolean): string {
  return shrinkable
    ? "Keep the intention. Cut the time, distance, scope, or commitment."
    : "If it cannot be made smaller, decide what it replaces.";
}
