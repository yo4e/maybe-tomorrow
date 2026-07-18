import { describe, expect, it } from "vitest";
import {
  calculatePostponeScore,
  chooseVerdict,
  selectExplanationFactors,
} from "../domain/scoring";
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

describe("calculatePostponeScore", () => {
  it("returns postpone at the exact score boundary of 6", () => {
    const decision = inputs({ energyCost: 2, dayLoad: 2, recoveryNeed: 2 });
    expect(calculatePostponeScore(decision)).toBe(6);
    expect(chooseVerdict(decision)).toBe("postpone");
  });

  it("returns reduce at the exact score boundary of 2", () => {
    const decision = inputs({ energyCost: 2 });
    expect(calculatePostponeScore(decision)).toBe(2);
    expect(chooseVerdict(decision)).toBe("reduce");
  });

  it("returns proceed below 2", () => {
    expect(chooseVerdict(inputs({ energyCost: 1 }))).toBe("proceed");
  });

  it("preserves half-point desire calculations", () => {
    expect(calculatePostponeScore(inputs({ energyCost: 2, desire: 1 }))).toBe(
      1.5,
    );
  });

  it("rejects malformed values", () => {
    expect(() =>
      chooseVerdict(inputs({ urgency: 5 as DecisionInputs["urgency"] })),
    ).toThrow(TypeError);
  });
});

describe("guardrails", () => {
  it("reduces a base postpone verdict for hard urgency and commitment", () => {
    const decision = inputs({
      urgency: 4,
      commitment: 3,
      energyCost: 4,
      dayLoad: 4,
      recoveryNeed: 4,
      tomorrowFlexibility: 4,
    });
    expect(calculatePostponeScore(decision)).toBe(9);
    expect(chooseVerdict(decision)).toBe("reduce");
  });

  it("prevents proceeding when urgency and commitment are low and it can wait", () => {
    const decision = inputs({
      urgency: 1,
      commitment: 1,
      desire: 4,
      tomorrowFlexibility: 3,
    });
    expect(calculatePostponeScore(decision)).toBe(-1);
    expect(chooseVerdict(decision)).toBe("reduce");
  });

  it("prevents proceeding under extreme overload", () => {
    const decision = inputs({
      urgency: 4,
      commitment: 4,
      desire: 4,
      energyCost: 3,
      dayLoad: 4,
      recoveryNeed: 4,
    });
    expect(calculatePostponeScore(decision)).toBe(1);
    expect(chooseVerdict(decision)).toBe("reduce");
  });
});

describe("representative scenarios", () => {
  it("postpones the optional gym visit", () => {
    expect(
      chooseVerdict(
        inputs({
          urgency: 0,
          commitment: 0,
          desire: 3,
          energyCost: 3,
          dayLoad: 4,
          recoveryNeed: 4,
          tomorrowFlexibility: 4,
        }),
      ),
    ).toBe("postpone");
  });

  it("proceeds with the promised client draft", () => {
    expect(
      chooseVerdict(
        inputs({
          urgency: 4,
          commitment: 4,
          desire: 1,
          energyCost: 3,
          dayLoad: 4,
          recoveryNeed: 3,
          tomorrowFlexibility: 0,
        }),
      ),
    ).toBe("proceed");
  });

  it("reduces the festival outing", () => {
    expect(
      chooseVerdict(
        inputs({
          urgency: 2,
          commitment: 0,
          desire: 4,
          energyCost: 3,
          dayLoad: 3,
          recoveryNeed: 2,
          tomorrowFlexibility: 1,
        }),
      ),
    ).toBe("reduce");
  });
});

describe("selectExplanationFactors", () => {
  it("uses stable tie ordering", () => {
    const decision = inputs({
      energyCost: 4,
      dayLoad: 4,
      recoveryNeed: 4,
      tomorrowFlexibility: 4,
    });
    expect(selectExplanationFactors(decision, "postpone")).toEqual([
      "dayLoad",
      "recoveryNeed",
      "energyCost",
    ]);
  });

  it("mixes postponement and necessity factors for reduce", () => {
    const decision = inputs({
      urgency: 3,
      energyCost: 3,
      dayLoad: 4,
    });
    expect(selectExplanationFactors(decision, "reduce")).toEqual([
      "dayLoad",
      "energyCost",
      "urgency",
    ]);
  });
});
