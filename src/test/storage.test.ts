import { describe, expect, it } from "vitest";
import { createDecision } from "../domain/scoring";
import type { Decision, DecisionInputs } from "../domain/types";
import {
  HISTORY_KEY,
  clearHistory,
  deleteDecision,
  loadHistory,
  saveDecision,
  type StorageLike,
} from "../storage/history";

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

const baseInputs: DecisionInputs = {
  urgency: 0,
  commitment: 0,
  desire: 4,
  energyCost: 4,
  dayLoad: 4,
  recoveryNeed: 3,
  tomorrowFlexibility: 4,
  shrinkable: true,
};

const makeDecision = (index: number): Decision => ({
  ...createDecision(`Activity ${index}`, baseInputs),
  id: `decision-${index}`,
  createdAt: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
});

describe("history storage", () => {
  it("saves and loads completed decisions newest first", () => {
    const storage = new MemoryStorage();
    saveDecision(makeDecision(1), storage);
    saveDecision(makeDecision(2), storage);

    expect(loadHistory(storage).value.map((item) => item.id)).toEqual([
      "decision-2",
      "decision-1",
    ]);
  });

  it("ignores malformed records without discarding valid ones", () => {
    const storage = new MemoryStorage();
    storage.setItem(HISTORY_KEY, JSON.stringify([makeDecision(1), { nope: true }]));

    const result = loadHistory(storage);
    expect(result.value).toHaveLength(1);
    expect(result.warning).toBe("malformed");
  });

  it("recovers from malformed JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(HISTORY_KEY, "not-json");

    expect(loadHistory(storage)).toMatchObject({
      ok: true,
      value: [],
      warning: "malformed",
    });
  });

  it("caps history at 50 items", () => {
    const storage = new MemoryStorage();
    for (let index = 0; index < 55; index += 1) {
      saveDecision(makeDecision(index), storage);
    }

    const result = loadHistory(storage);
    expect(result.value).toHaveLength(50);
    expect(result.value[0]?.id).toBe("decision-54");
    expect(result.value.at(-1)?.id).toBe("decision-5");
  });

  it("deletes one decision and clears all history", () => {
    const storage = new MemoryStorage();
    saveDecision(makeDecision(1), storage);
    saveDecision(makeDecision(2), storage);

    expect(deleteDecision("decision-1", storage).value).toHaveLength(1);
    expect(clearHistory(storage).value).toEqual([]);
    expect(loadHistory(storage).value).toEqual([]);
  });

  it("returns a non-blocking warning when storage throws", () => {
    const storage: StorageLike = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };

    expect(loadHistory(storage)).toMatchObject({
      ok: false,
      value: [],
      warning: "unavailable",
    });
  });
});
