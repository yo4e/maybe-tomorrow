import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DecisionResult } from "../components/DecisionResult";
import { createDecision } from "../domain/scoring";
import type { DecisionInputs, Verdict } from "../domain/types";

function visibleText(markup: string): string {
  const container = document.createElement("div");
  container.innerHTML = markup;
  return container.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

const scenarios: Array<{
  expectedStatement: string;
  expectedVerdict: Verdict;
  inputs: DecisionInputs;
}> = [
  {
    expectedVerdict: "postpone",
    expectedStatement:
      "“Start another side project” does not need another piece of today.",
    inputs: {
      urgency: 0,
      commitment: 0,
      desire: 4,
      energyCost: 4,
      dayLoad: 4,
      recoveryNeed: 3,
      tomorrowFlexibility: 4,
      shrinkable: true,
    },
  },
  {
    expectedVerdict: "reduce",
    expectedStatement:
      "“Start another side project” may matter, but the full-size version does not own today.",
    inputs: {
      urgency: 2,
      commitment: 0,
      desire: 4,
      energyCost: 3,
      dayLoad: 3,
      recoveryNeed: 2,
      tomorrowFlexibility: 1,
      shrinkable: true,
    },
  },
  {
    expectedVerdict: "proceed",
    expectedStatement:
      "“Start another side project” may need to happen today.",
    inputs: {
      urgency: 4,
      commitment: 4,
      desire: 1,
      energyCost: 3,
      dayLoad: 4,
      recoveryNeed: 3,
      tomorrowFlexibility: 0,
      shrinkable: true,
    },
  },
];

describe("DecisionResult copy", () => {
  it.each(scenarios)(
    "presents an imperative activity as a quoted phrase for the $expectedVerdict verdict",
    ({ expectedStatement, expectedVerdict, inputs }) => {
      const decision = createDecision("Start another side project", inputs);
      const text = visibleText(
        renderToStaticMarkup(
          <DecisionResult
            decision={decision}
            onSave={() => undefined}
            onTryAnother={() => undefined}
            saved={false}
          />,
        ),
      );

      expect(decision.verdict).toBe(expectedVerdict);
      expect(text).toContain(expectedStatement);
    },
  );

  it("does not add a second period after a punctuated target verdict", () => {
    const decision = createDecision("Start another side project", scenarios[0]!.inputs);
    const text = visibleText(
      renderToStaticMarkup(
        <DecisionResult
          decision={decision}
          onSave={() => undefined}
          onTryAnother={() => undefined}
          saved={false}
        />,
      ),
    );

    expect(text).toContain("Your answers stay as they are.");
    expect(text).not.toContain(".”.");
  });
});
