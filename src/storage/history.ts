import { isDecisionInputs } from "../domain/scoring";
import type { Decision, FactorKey, Verdict } from "../domain/types";

export const HISTORY_KEY = "maybe-tomorrow:history:v1";
export const HISTORY_LIMIT = 50;

export type StorageWarning = "unavailable" | "malformed";

export type StorageResult<T> = {
  ok: boolean;
  value: T;
  warning?: StorageWarning;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const VALID_VERDICTS: Verdict[] = ["postpone", "reduce", "proceed"];
const VALID_FACTORS: FactorKey[] = [
  "urgency",
  "commitment",
  "desire",
  "energyCost",
  "dayLoad",
  "recoveryNeed",
  "tomorrowFlexibility",
];

function resolveStorage(storage?: StorageLike): StorageLike | undefined {
  if (storage) {
    return storage;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function isDecision(value: unknown): value is Decision {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.activity === "string" &&
    candidate.activity.trim().length > 0 &&
    candidate.activity.trim().length <= 80 &&
    isDecisionInputs(candidate.inputs) &&
    typeof candidate.score === "number" &&
    Number.isFinite(candidate.score) &&
    VALID_VERDICTS.includes(candidate.verdict as Verdict) &&
    Array.isArray(candidate.factors) &&
    candidate.factors.length <= 3 &&
    candidate.factors.every((factor) =>
      VALID_FACTORS.includes(factor as FactorKey),
    ) &&
    typeof candidate.createdAt === "string" &&
    Number.isFinite(Date.parse(candidate.createdAt))
  );
}

function sortNewestFirst(decisions: Decision[]): Decision[] {
  return [...decisions].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

export function loadHistory(storage?: StorageLike): StorageResult<Decision[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  try {
    const raw = target.getItem(HISTORY_KEY);
    if (raw === null) {
      return { ok: true, value: [] };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { ok: true, value: [], warning: "malformed" };
    }

    const decisions = parsed.filter(isDecision);
    const result: StorageResult<Decision[]> = {
      ok: true,
      value: sortNewestFirst(decisions).slice(0, HISTORY_LIMIT),
    };

    if (decisions.length !== parsed.length) {
      result.warning = "malformed";
    }

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { ok: true, value: [], warning: "malformed" };
    }
    return { ok: false, value: [], warning: "unavailable" };
  }
}

export function saveDecision(
  decision: Decision,
  storage?: StorageLike,
): StorageResult<Decision[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const existing = loadHistory(target);
  if (!existing.ok) {
    return existing;
  }

  const next = sortNewestFirst([
    decision,
    ...existing.value.filter((item) => item.id !== decision.id),
  ]).slice(0, HISTORY_LIMIT);

  try {
    target.setItem(HISTORY_KEY, JSON.stringify(next));
    const result: StorageResult<Decision[]> = { ok: true, value: next };
    if (existing.warning) {
      result.warning = existing.warning;
    }
    return result;
  } catch {
    return {
      ok: false,
      value: existing.value,
      warning: "unavailable",
    };
  }
}

export function deleteDecision(
  id: string,
  storage?: StorageLike,
): StorageResult<Decision[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  const existing = loadHistory(target);
  if (!existing.ok) {
    return existing;
  }

  const next = existing.value.filter((decision) => decision.id !== id);
  try {
    target.setItem(HISTORY_KEY, JSON.stringify(next));
    const result: StorageResult<Decision[]> = { ok: true, value: next };
    if (existing.warning) {
      result.warning = existing.warning;
    }
    return result;
  } catch {
    return {
      ok: false,
      value: existing.value,
      warning: "unavailable",
    };
  }
}

export function clearHistory(storage?: StorageLike): StorageResult<Decision[]> {
  const target = resolveStorage(storage);
  if (!target) {
    return { ok: false, value: [], warning: "unavailable" };
  }

  try {
    target.removeItem(HISTORY_KEY);
    return { ok: true, value: [] };
  } catch {
    const existing = loadHistory(target);
    return {
      ok: false,
      value: existing.value,
      warning: "unavailable",
    };
  }
}
