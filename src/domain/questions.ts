import type { FactorKey, ScoreValue } from "./types";

export type QuestionOption = {
  label: string;
  value: ScoreValue;
};

export type QuestionDefinition = {
  key: FactorKey;
  heading: string;
  options: QuestionOption[];
};

const option = (value: ScoreValue, label: string): QuestionOption => ({
  value,
  label,
});

export const QUESTIONS: QuestionDefinition[] = [
  {
    key: "urgency",
    heading: "How urgent is this, really?",
    options: [
      option(0, "Not urgent"),
      option(1, "Barely"),
      option(2, "Somewhat"),
      option(3, "Quite urgent"),
      option(4, "Must happen today"),
    ],
  },
  {
    key: "commitment",
    heading: "Is someone else depending on you?",
    options: [
      option(0, "No"),
      option(1, "Not really"),
      option(2, "A little"),
      option(3, "Yes"),
      option(4, "Strong commitment"),
    ],
  },
  {
    key: "desire",
    heading: "How much do you genuinely want to do it?",
    options: [
      option(0, "I do not"),
      option(1, "Not much"),
      option(2, "Mixed"),
      option(3, "I want to"),
      option(4, "Very much"),
    ],
  },
  {
    key: "energyCost",
    heading: "How much energy will it take?",
    options: [
      option(0, "Almost none"),
      option(1, "A little"),
      option(2, "Moderate"),
      option(3, "A lot"),
      option(4, "A great deal"),
    ],
  },
  {
    key: "dayLoad",
    heading: "How full is today already?",
    options: [
      option(0, "Wide open"),
      option(1, "Light"),
      option(2, "Normal"),
      option(3, "Full"),
      option(4, "Overfull"),
    ],
  },
  {
    key: "recoveryNeed",
    heading: "How much recovery do you need today?",
    options: [
      option(0, "Very little"),
      option(1, "A little"),
      option(2, "Some"),
      option(3, "Quite a lot"),
      option(4, "A lot"),
    ],
  },
  {
    key: "tomorrowFlexibility",
    heading: "Could this realistically wait until tomorrow?",
    options: [
      option(0, "No"),
      option(1, "Probably not"),
      option(2, "Maybe"),
      option(3, "Probably"),
      option(4, "Easily"),
    ],
  },
];
