export type ScoreValue = 0 | 1 | 2 | 3 | 4;

export type Verdict = "postpone" | "reduce" | "proceed";

export type FactorKey =
  | "urgency"
  | "commitment"
  | "desire"
  | "energyCost"
  | "dayLoad"
  | "recoveryNeed"
  | "tomorrowFlexibility";

export type ScoredFactorKey = Exclude<FactorKey, never>;

export type PrimaryDecisionInputs = Record<FactorKey, ScoreValue>;

export type DecisionInputs = PrimaryDecisionInputs & {
  shrinkable: boolean;
};

export type Decision = {
  id: string;
  activity: string;
  inputs: DecisionInputs;
  score: number;
  verdict: Verdict;
  factors: FactorKey[];
  createdAt: string;
};
