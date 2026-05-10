import { describe, expect, it } from "vitest";
import type { Employee, Suggestion } from "~/types/suggestion";
import {
  filterSuggestionsByFacets,
  filterSuggestionsBySearchQuery,
  filterSuggestionsByTableState,
} from "~/utils/suggestionTableFilters";

const employees: Record<string, Employee> = {
  e1: { id: "e1", name: "Alice Smith", department: "HR", riskLevel: "high" },
  e2: { id: "e2", name: "Bob Jones", department: "Ops", riskLevel: "low" },
};

const baseSuggestion = (overrides: Partial<Suggestion>): Suggestion => ({
  id: "s-default",
  employeeId: "e1",
  type: "equipment",
  description: "Ergonomic keyboard",
  priority: "medium",
  source: "vida",
  status: "pending",
  dateCreated: "2024-01-01T00:00:00Z",
  dateUpdated: "2024-01-01T00:00:00Z",
  notes: "",
  ...overrides,
});

const defaultFacets = {
  priorityFilter: "All" as const,
  statusFilter: "All" as const,
  selectedTypes: [] as Suggestion["type"][],
};

describe("filterSuggestionsByFacets", () => {
  it("returns all items when facet filters are default", () => {
    const items = [
      baseSuggestion({ id: "a", employeeId: "e1" }),
      baseSuggestion({ id: "b", employeeId: "e2", type: "exercise" }),
    ];
    const result = filterSuggestionsByFacets(items, defaultFacets);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("filters by priority", () => {
    const items = [
      baseSuggestion({ id: "high", priority: "high" }),
      baseSuggestion({ id: "low", priority: "low" }),
    ];
    const result = filterSuggestionsByFacets(items, {
      ...defaultFacets,
      priorityFilter: "high",
    });
    expect(result.map((s) => s.id)).toEqual(["high"]);
  });

  it("filters by status", () => {
    const items = [
      baseSuggestion({ id: "p", status: "pending" }),
      baseSuggestion({ id: "c", status: "completed" }),
    ];
    const result = filterSuggestionsByFacets(items, {
      ...defaultFacets,
      statusFilter: "completed",
    });
    expect(result.map((s) => s.id)).toEqual(["c"]);
  });

  it("applies partial type selection only (empty types = no type filter)", () => {
    const items = [
      baseSuggestion({ id: "eq", type: "equipment" }),
      baseSuggestion({ id: "ex", type: "exercise" }),
    ];
    const result = filterSuggestionsByFacets(items, {
      ...defaultFacets,
      selectedTypes: ["equipment"],
    });
    expect(result.map((s) => s.id)).toEqual(["eq"]);
  });

  it("does not filter by type when all types are selected (same as empty)", () => {
    const items = [
      baseSuggestion({ id: "eq", type: "equipment" }),
      baseSuggestion({ id: "ex", type: "exercise" }),
    ];
    const allTypes = [
      "equipment",
      "exercise",
      "behavioural",
      "lifestyle",
    ] as const;
    const result = filterSuggestionsByFacets(items, {
      ...defaultFacets,
      selectedTypes: [...allTypes],
    });
    expect(result).toHaveLength(2);
  });
});

describe("filterSuggestionsBySearchQuery", () => {
  it("returns all items when search is empty", () => {
    const items = [
      baseSuggestion({ id: "a" }),
      baseSuggestion({ id: "b", employeeId: "e2" }),
    ];
    const result = filterSuggestionsBySearchQuery(items, employees, "");
    expect(result).toHaveLength(2);
  });

  it("matches employee name case-insensitively", () => {
    const items = [baseSuggestion({ id: "x", employeeId: "e1" })];
    const result = filterSuggestionsBySearchQuery(items, employees, "ALICE");
    expect(result).toHaveLength(1);
  });

  it("matches suggestion description case-insensitively", () => {
    const items = [
      baseSuggestion({
        id: "x",
        description: "Use a standing desk twice daily",
      }),
    ];
    const result = filterSuggestionsBySearchQuery(
      items,
      employees,
      "STANDING",
    );
    expect(result).toHaveLength(1);
  });
});

describe("filterSuggestionsByTableState (facets then search)", () => {
  it("matches composing facet filter then search", () => {
    const items = [
      baseSuggestion({
        id: "keep",
        employeeId: "e1",
        priority: "high",
        description: "Stretch breaks",
      }),
      baseSuggestion({
        id: "drop-priority",
        employeeId: "e1",
        priority: "low",
        description: "Stretch breaks",
      }),
      baseSuggestion({
        id: "drop-search",
        employeeId: "e2",
        priority: "high",
        description: "Other topic",
      }),
    ];
    const state = {
      priorityFilter: "high" as const,
      statusFilter: "All" as const,
      selectedTypes: [] as Suggestion["type"][],
      searchQuery: "stretch",
    };
    const composed = filterSuggestionsBySearchQuery(
      filterSuggestionsByFacets(items, {
        priorityFilter: state.priorityFilter,
        statusFilter: state.statusFilter,
        selectedTypes: state.selectedTypes,
      }),
      employees,
      state.searchQuery,
    );
    const combined = filterSuggestionsByTableState(items, employees, state);
    expect(combined.map((s) => s.id)).toEqual(["keep"]);
    expect(combined).toEqual(composed);
  });
});
