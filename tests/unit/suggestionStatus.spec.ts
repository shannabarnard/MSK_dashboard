import { describe, expect, it } from "vitest";
import {
  canTransitionStatus,
  getNextStatuses,
} from "~/utils/domain/suggestionStatus";

describe("suggestionStatus transitions", () => {
  it("allows pending to move to in_progress, completed, or overdue", () => {
    expect(canTransitionStatus("pending", "in_progress")).toBe(true);
    expect(canTransitionStatus("pending", "completed")).toBe(true);
    expect(canTransitionStatus("pending", "overdue")).toBe(true);
  });

  it("rejects leaving completed for another status", () => {
    expect(canTransitionStatus("completed", "pending")).toBe(false);
    expect(canTransitionStatus("completed", "in_progress")).toBe(false);
    expect(getNextStatuses("completed")).toEqual([]);
  });

  it("treats same status as always valid (no-op)", () => {
    expect(canTransitionStatus("in_progress", "in_progress")).toBe(true);
  });
});
