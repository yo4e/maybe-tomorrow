import { describe, expect, it } from "vitest";
import { findCounterfactuals } from "../domain/counterfactual";
import { chooseVerdict } from "../domain/scoring";
import type { DecisionInputs } from "../domain/types";

const inputs = (overrides: Partial<DecisionInputs> = {}): DecisionInputs => ({
  urgency: 0,
  commitment: 0,
  desire: 0,
  energyCost: 0,
  dayLoad: 0,
  recoveryNeed: 0,
  tomorrowFlexibility: 0,
  shrinkable: true,
  ...overrides,
});

describe("findCounterfactuals", () => {
  it("searches the complete answer space and crosses the postpone boundary minimally", () => {
    const result = findCounterfactuals(
      inputs({ energyCost: 2, dayLoad: 2, recoveryNeed: 2 }),
    );

    expect(result.originalVerdict).toBe("postpone");
    expect(result.targetVerdict).toBe("reduce");
    expect(result.originalScore).toBe(6);
    expect(result.searchedStates).toBe(78_125);
    expect(result.alternatives).toHaveLength(3);
    expect(result.alternatives.map((alternative) => alternative.changes[0]!.factor)).toEqual([
      "dayLoad",
      "recoveryNeed",
      "energyCost",
    ]);
    expect(result.alternatives.every((alternative) => alternative.distance === 1)).toBe(true);
  });

  it("moves reduce toward proceed and preserves shrinkable", () => {
    const result = findCounterfactuals(
      inputs({ energyCost: 2, shrinkable: false }),
    );

    expect(result.originalVerdict).toBe("reduce");
    expect(result.targetVerdict).toBe("proceed");
    expect(result.alternatives[0]!.changedFieldCount).toBe(1);
    expect(result.alternatives[0]!.distance).toBe(1);
    expect(result.alternatives.every((alternative) => !alternative.inputs.shrinkable)).toBe(true);
    expect(result.alternatives.every((alternative) => chooseVerdict(alternative.inputs) === "proceed")).toBe(true);
  });

  it("moves a proceed verdict in the protective direction toward reduce", () => {
    const result = findCounterfactuals(inputs({ energyCost: 1 }));

    expect(result.originalVerdict).toBe("proceed");
    expect(result.targetVerdict).toBe("reduce");
    expect(result.alternatives[0]!.changes).toEqual([
      { factor: "dayLoad", from: 0, to: 1, steps: 1 },
    ]);
    expect(result.alternatives.every((alternative) => alternative.targetScore >= result.originalScore)).toBe(true);
  });

  it("uses the documented guardrails rather than score thresholds alone", () => {
    const guarded = inputs({
      urgency: 1,
      commitment: 1,
      desire: 4,
      tomorrowFlexibility: 3,
    });
    expect(chooseVerdict(guarded)).toBe("reduce");

    const result = findCounterfactuals(guarded);
    expect(result.targetVerdict).toBe("proceed");
    expect(result.alternatives[0]!.changes).toEqual([
      { factor: "tomorrowFlexibility", from: 3, to: 2, steps: 1 },
    ]);
    expect(chooseVerdict(result.alternatives[0]!.inputs)).toBe("proceed");
  });

  it("is deterministic and honors an explicit result limit", () => {
    const decision = inputs({ energyCost: 2, dayLoad: 2, recoveryNeed: 2 });
    expect(findCounterfactuals(decision, 2)).toEqual(findCounterfactuals(decision, 2));
    expect(findCounterfactuals(decision, 2).alternatives).toHaveLength(2);
    expect(findCounterfactuals(decision, 0).alternatives).toEqual([]);
  });
});
