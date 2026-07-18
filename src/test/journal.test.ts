import { describe, expect, it } from "vitest";
import { createDecision } from "../domain/scoring";
import type { Decision, DecisionInputs } from "../domain/types";
import { HISTORY_KEY, type StorageLike } from "../storage/history";
import {
  JOURNAL_KEY,
  addJournalEntry,
  clearJournal,
  deleteJournalEntry,
  isJournalEntry,
  loadJournal,
  saveJournal,
  type DayPlanJournalEntry,
  type JournalEntry,
  type QuickCheckJournalEntry,
} from "../storage/journal";

class MemoryStorage implements StorageLike {
  readonly values = new Map<string, string>();

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

const quickEntry = (index: number): QuickCheckJournalEntry => {
  const decision = makeDecision(index);
  return {
    version: 2,
    kind: "quick-check",
    id: `journal-${index}`,
    savedAt: decision.createdAt,
    decision,
  };
};

const dayEntry = (index: number): DayPlanJournalEntry => {
  const decision = makeDecision(index);
  return {
    version: 2,
    kind: "day-plan",
    id: `journal-${index}`,
    savedAt: decision.createdAt,
    decision,
    dayContext: {
      snapshotId: "overfull-tuesday",
      snapshotName: "Yoshie's Overfull Tuesday",
      selectedDate: "2026-07-21",
      metrics: {
        eventCount: 6,
        occupiedMinutes: 510,
        freeMinutes: 180,
        overlapMinutes: 30,
        fragmentedGapCount: 3,
        protectedRecoveryMinutes: 60,
      },
      candidateMinutes: 90,
      selectedPlan: {
        summary: "Make space without touching recovery.",
        operations: ["Postpone the movable workout.", "Protect lunch."],
      },
    },
  };
};

describe("decision journal storage", () => {
  it("saves both entry kinds and loads them newest first", () => {
    const storage = new MemoryStorage();

    expect(saveJournal([quickEntry(1), dayEntry(2)], storage)).toMatchObject({
      ok: true,
      value: [{ id: "journal-2" }, { id: "journal-1" }],
    });
    expect(loadJournal(storage).value.map((entry) => entry.kind)).toEqual([
      "day-plan",
      "quick-check",
    ]);
  });

  it("migrates valid v1 decisions only when v2 is absent", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      HISTORY_KEY,
      JSON.stringify([makeDecision(1), { not: "a decision" }, makeDecision(2)]),
    );

    const result = loadJournal(storage);
    expect(result).toMatchObject({
      ok: true,
      warning: "malformed",
      value: [
        { version: 2, kind: "quick-check", id: "decision-2" },
        { version: 2, kind: "quick-check", id: "decision-1" },
      ],
    });
    expect(storage.getItem(JOURNAL_KEY)).not.toBeNull();
    expect(storage.getItem(HISTORY_KEY)).toBeNull();
  });

  it("does not delete v1 when the migration write fails", () => {
    const legacy = JSON.stringify([makeDecision(1)]);
    let removedLegacy = false;
    const storage: StorageLike = {
      getItem(key) {
        if (key === JOURNAL_KEY) return null;
        return key === HISTORY_KEY ? legacy : null;
      },
      setItem() {
        throw new Error("quota exceeded");
      },
      removeItem(key) {
        if (key === HISTORY_KEY) removedLegacy = true;
      },
    };

    expect(loadJournal(storage)).toMatchObject({
      ok: false,
      warning: "unavailable",
      value: [{ id: "decision-1" }],
    });
    expect(removedLegacy).toBe(false);
    expect(storage.getItem(HISTORY_KEY)).toBe(legacy);
  });

  it("ignores malformed v2 records while retaining valid entries", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      JOURNAL_KEY,
      JSON.stringify([
        dayEntry(1),
        { ...dayEntry(2), dayContext: { ...dayEntry(2).dayContext, candidateMinutes: -1 } },
      ]),
    );

    expect(loadJournal(storage)).toMatchObject({
      ok: true,
      warning: "malformed",
      value: [{ id: "journal-1" }],
    });
  });

  it("recovers from malformed JSON and unavailable storage", () => {
    const malformed = new MemoryStorage();
    malformed.setItem(JOURNAL_KEY, "not-json");
    expect(loadJournal(malformed)).toMatchObject({
      ok: true,
      value: [],
      warning: "malformed",
    });

    const unavailable: StorageLike = {
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
    expect(loadJournal(unavailable)).toMatchObject({
      ok: false,
      value: [],
      warning: "unavailable",
    });
  });

  it("caps the journal at 50 entries", () => {
    const storage = new MemoryStorage();
    const entries = Array.from({ length: 55 }, (_, index) => quickEntry(index));

    const result = saveJournal(entries, storage);
    expect(result.value).toHaveLength(50);
    expect(result.value[0]?.id).toBe("journal-54");
    expect(result.value.at(-1)?.id).toBe("journal-5");
  });

  it("adds by id, deletes one entry, and clears without legacy resurrection", () => {
    const storage = new MemoryStorage();
    addJournalEntry(quickEntry(1), storage);
    addJournalEntry(dayEntry(2), storage);
    addJournalEntry({ ...quickEntry(3), id: "journal-1" }, storage);

    expect(loadJournal(storage).value.map((entry) => entry.id)).toEqual([
      "journal-1",
      "journal-2",
    ]);
    expect(deleteJournalEntry("journal-2", storage).value).toHaveLength(1);

    storage.setItem(HISTORY_KEY, JSON.stringify([makeDecision(9)]));
    expect(clearJournal(storage)).toEqual({ ok: true, value: [] });
    expect(loadJournal(storage).value).toEqual([]);
  });

  it("whitelists persisted fields so file bytes and full snapshots are not stored", () => {
    const storage = new MemoryStorage();
    const unsafe = {
      ...dayEntry(1),
      fileBytes: "private-calendar-file",
      decision: { ...makeDecision(1), hiddenSnapshot: "private-decision-data" },
      dayContext: {
        ...dayEntry(1).dayContext,
        fullSnapshot: "private-full-snapshot",
        selectedPlan: {
          ...dayEntry(1).dayContext.selectedPlan,
          internalEvents: ["private-event"],
        },
      },
    } as unknown as JournalEntry;

    expect(isJournalEntry(unsafe)).toBe(true);
    expect(saveJournal([unsafe], storage).ok).toBe(true);

    const raw = storage.getItem(JOURNAL_KEY) ?? "";
    expect(raw).not.toContain("private-calendar-file");
    expect(raw).not.toContain("private-decision-data");
    expect(raw).not.toContain("private-full-snapshot");
    expect(raw).not.toContain("private-event");
  });
});
