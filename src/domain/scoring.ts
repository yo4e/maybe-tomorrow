import type {
  Decision,
  DecisionInputs,
  FactorKey,
  ScoreValue,
  Verdict,
} from "./types";

const FACTOR_ORDER: FactorKey[] = [
  "dayLoad",
  "recoveryNeed",
  "energyCost",
  "tomorrowFlexibility",
  "urgency",
  "commitment",
  "desire",
];

const POSITIVE_FACTORS: FactorKey[] = [
  "dayLoad",
  "recoveryNeed",
  "energyCost",
  "tomorrowFlexibility",
];

const NEGATIVE_FACTORS: FactorKey[] = [
  "urgency",
  "commitment",
  "desire",
];

const isScoreValue = (value: unknown): value is ScoreValue =>
  Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 4;

export function isDecisionInputs(value: unknown): value is DecisionInputs {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    isScoreValue(candidate.urgency) &&
    isScoreValue(candidate.commitment) &&
    isScoreValue(candidate.desire) &&
    isScoreValue(candidate.energyCost) &&
    isScoreValue(candidate.dayLoad) &&
    isScoreValue(candidate.recoveryNeed) &&
    isScoreValue(candidate.tomorrowFlexibility) &&
    typeof candidate.shrinkable === "boolean"
  );
}

function assertDecisionInputs(inputs: DecisionInputs): void {
  if (!isDecisionInputs(inputs)) {
    throw new TypeError("Decision inputs must contain values from 0 to 4.");
  }
}

export function calculatePostponeScore(inputs: DecisionInputs): number {
  assertDecisionInputs(inputs);

  const postponementPressure =
    inputs.energyCost +
    inputs.dayLoad +
    inputs.recoveryNeed +
    inputs.tomorrowFlexibility;

  const todayNecessity =
    inputs.urgency + inputs.commitment + inputs.desire * 0.5;

  return postponementPressure - todayNecessity;
}

export function chooseVerdict(inputs: DecisionInputs): Verdict {
  const score = calculatePostponeScore(inputs);
  let verdict: Verdict =
    score >= 6 ? "postpone" : score >= 2 ? "reduce" : "proceed";

  if (
    verdict === "postpone" &&
    inputs.urgency === 4 &&
    inputs.commitment >= 3
  ) {
    verdict = "reduce";
  }

  if (
    verdict === "proceed" &&
    inputs.urgency <= 1 &&
    inputs.commitment <= 1 &&
    inputs.tomorrowFlexibility >= 3
  ) {
    verdict = "reduce";
  }

  if (
    verdict === "proceed" &&
    inputs.dayLoad === 4 &&
    inputs.recoveryNeed === 4 &&
    inputs.energyCost >= 3
  ) {
    verdict = "reduce";
  }

  return verdict;
}

function contribution(inputs: DecisionInputs, key: FactorKey): number {
  return key === "desire" ? inputs.desire * 0.5 : inputs[key];
}

function rankedFactors(inputs: DecisionInputs, keys: FactorKey[]): FactorKey[] {
  return [...keys].sort((a, b) => {
    const difference = contribution(inputs, b) - contribution(inputs, a);
    return difference || FACTOR_ORDER.indexOf(a) - FACTOR_ORDER.indexOf(b);
  });
}

function fillToMinimum(
  selected: FactorKey[],
  inputs: DecisionInputs,
  minimum = 2,
): FactorKey[] {
  if (selected.length >= minimum) {
    return selected.slice(0, 3);
  }

  const remaining = rankedFactors(inputs, FACTOR_ORDER).filter(
    (key) => !selected.includes(key),
  );

  return [...selected, ...remaining.slice(0, minimum - selected.length)].slice(
    0,
    3,
  );
}

export function selectExplanationFactors(
  inputs: DecisionInputs,
  verdict: Verdict,
): FactorKey[] {
  assertDecisionInputs(inputs);

  const positives = rankedFactors(inputs, POSITIVE_FACTORS);
  const negatives = rankedFactors(inputs, NEGATIVE_FACTORS);

  if (verdict === "postpone") {
    const qualifying = positives.filter(
      (key) => contribution(inputs, key) >= 2,
    );
    return fillToMinimum(qualifying.slice(0, 3), inputs);
  }

  if (verdict === "proceed") {
    const qualifying = negatives.filter(
      (key) => contribution(inputs, key) >= 2,
    );
    return fillToMinimum(qualifying.slice(0, 3), inputs);
  }

  const selected = [
    ...positives.filter((key) => contribution(inputs, key) >= 2).slice(0, 2),
    ...negatives.filter((key) => contribution(inputs, key) >= 2).slice(0, 1),
  ];

  return fillToMinimum(selected, inputs);
}

function createLocalId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `decision-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createDecision(
  activity: string,
  inputs: DecisionInputs,
): Decision {
  const cleanActivity = activity.trim();
  if (cleanActivity.length < 1 || cleanActivity.length > 80) {
    throw new RangeError("Activity must be between 1 and 80 characters.");
  }

  const verdict = chooseVerdict(inputs);
  return {
    id: createLocalId(),
    activity: cleanActivity,
    inputs: { ...inputs },
    score: calculatePostponeScore(inputs),
    verdict,
    factors: selectExplanationFactors(inputs, verdict),
    createdAt: new Date().toISOString(),
  };
}
