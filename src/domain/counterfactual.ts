import { calculatePostponeScore, chooseVerdict } from "./scoring";
import type {
  DecisionInputs,
  FactorKey,
  PrimaryDecisionInputs,
  ScoreValue,
  Verdict,
} from "./types";

const FACTOR_ORDER: readonly FactorKey[] = [
  "dayLoad",
  "recoveryNeed",
  "energyCost",
  "tomorrowFlexibility",
  "urgency",
  "commitment",
  "desire",
];

const NECESSITY_FACTORS = new Set<FactorKey>([
  "urgency",
  "commitment",
  "desire",
]);

const SEARCH_FIELD_ORDER: readonly FactorKey[] = [
  "urgency",
  "commitment",
  "desire",
  "energyCost",
  "dayLoad",
  "recoveryNeed",
  "tomorrowFlexibility",
];

const SCORE_VALUES: readonly ScoreValue[] = [0, 1, 2, 3, 4];
const SEARCH_SPACE_SIZE = 5 ** SEARCH_FIELD_ORDER.length;

export type CounterfactualChange = {
  factor: FactorKey;
  from: ScoreValue;
  to: ScoreValue;
  steps: number;
};

export type CounterfactualAlternative = {
  inputs: DecisionInputs;
  verdict: Verdict;
  targetScore: number;
  changedFieldCount: number;
  distance: number;
  changes: CounterfactualChange[];
};

export type CounterfactualResult = {
  originalVerdict: Verdict;
  targetVerdict: Verdict;
  originalScore: number;
  alternatives: CounterfactualAlternative[];
  searchedStates: number;
};

function nextVerdict(verdict: Verdict): Verdict {
  if (verdict === "postpone") return "reduce";
  if (verdict === "reduce") return "proceed";
  return "reduce";
}

function decodeState(index: number): PrimaryDecisionInputs {
  let remaining = index;
  const decoded = {} as PrimaryDecisionInputs;

  for (const factor of SEARCH_FIELD_ORDER) {
    decoded[factor] = SCORE_VALUES[remaining % SCORE_VALUES.length]!;
    remaining = Math.floor(remaining / SCORE_VALUES.length);
  }

  return decoded;
}

function movesTowardTarget(
  original: DecisionInputs,
  candidate: PrimaryDecisionInputs,
  originalVerdict: Verdict,
): boolean {
  const movingTowardPermission = originalVerdict !== "proceed";

  return SEARCH_FIELD_ORDER.every((factor) => {
    const from = original[factor];
    const to = candidate[factor];
    const isNecessity = NECESSITY_FACTORS.has(factor);

    if (movingTowardPermission) {
      return isNecessity ? to >= from : to <= from;
    }

    return isNecessity ? to <= from : to >= from;
  });
}

function describeChanges(
  original: DecisionInputs,
  candidate: PrimaryDecisionInputs,
): CounterfactualChange[] {
  return FACTOR_ORDER.flatMap((factor) => {
    const from = original[factor];
    const to = candidate[factor];

    return from === to
      ? []
      : [{ factor, from, to, steps: Math.abs(to - from) }];
  });
}

function compareStableAlternatives(
  a: CounterfactualAlternative,
  b: CounterfactualAlternative,
): number {
  if (a.changedFieldCount !== b.changedFieldCount) {
    return a.changedFieldCount - b.changedFieldCount;
  }
  if (a.distance !== b.distance) return a.distance - b.distance;

  for (let index = 0; index < a.changes.length; index += 1) {
    const aChange = a.changes[index]!;
    const bChange = b.changes[index]!;
    const factorDifference =
      FACTOR_ORDER.indexOf(aChange.factor) - FACTOR_ORDER.indexOf(bChange.factor);

    if (factorDifference !== 0) return factorDifference;
    if (aChange.steps !== bChange.steps) return aChange.steps - bChange.steps;
    if (aChange.to !== bChange.to) return aChange.to - bChange.to;
  }

  return 0;
}

/**
 * Finds the closest adjacent verdict without changing the meaning of an answer
 * in the wrong direction. The complete 5^7 answer space is examined, including
 * all guardrails in chooseVerdict. The binary shrinkable answer is preserved
 * because it changes result copy, not the verdict.
 */
export function findCounterfactuals(
  inputs: DecisionInputs,
  limit = 3,
): CounterfactualResult {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError("Counterfactual limit must be a non-negative integer.");
  }

  const originalVerdict = chooseVerdict(inputs);
  const targetVerdict = nextVerdict(originalVerdict);
  const originalScore = calculatePostponeScore(inputs);
  let bestChangedFieldCount = Number.POSITIVE_INFINITY;
  let bestDistance = Number.POSITIVE_INFINITY;
  let alternatives: CounterfactualAlternative[] = [];

  for (let index = 0; index < SEARCH_SPACE_SIZE; index += 1) {
    const primaryInputs = decodeState(index);

    if (!movesTowardTarget(inputs, primaryInputs, originalVerdict)) continue;

    const candidateInputs: DecisionInputs = {
      ...primaryInputs,
      shrinkable: inputs.shrinkable,
    };

    if (chooseVerdict(candidateInputs) !== targetVerdict) continue;

    const changes = describeChanges(inputs, primaryInputs);
    const changedFieldCount = changes.length;
    const distance = changes.reduce((sum, change) => sum + change.steps, 0);

    if (
      changedFieldCount > bestChangedFieldCount ||
      (changedFieldCount === bestChangedFieldCount && distance > bestDistance)
    ) {
      continue;
    }

    const alternative: CounterfactualAlternative = {
      inputs: candidateInputs,
      verdict: targetVerdict,
      targetScore: calculatePostponeScore(candidateInputs),
      changedFieldCount,
      distance,
      changes,
    };

    if (
      changedFieldCount < bestChangedFieldCount ||
      (changedFieldCount === bestChangedFieldCount && distance < bestDistance)
    ) {
      bestChangedFieldCount = changedFieldCount;
      bestDistance = distance;
      alternatives = [alternative];
    } else {
      alternatives.push(alternative);
    }
  }

  alternatives.sort(compareStableAlternatives);

  return {
    originalVerdict,
    targetVerdict,
    originalScore,
    alternatives: alternatives.slice(0, limit),
    searchedStates: SEARCH_SPACE_SIZE,
  };
}
