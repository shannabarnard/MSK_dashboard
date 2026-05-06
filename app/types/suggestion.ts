export type SuggestionStatus = "pending" | "in_progress" | "completed" | "overdue";
export type SuggestionPriority = "high" | "medium" | "low";
export type SuggestionType = "equipment" | "exercise" | "behavioural" | "lifestyle";
export type SuggestionSource = "vida" | "admin";

export type Employee = {
  id: string;
  name: string;
  department: string;
  riskLevel: SuggestionPriority;
};

export type Suggestion = {
  id: string;
  employeeId: string;
  type: SuggestionType;
  description: string;
  priority: SuggestionPriority;
  source: SuggestionSource;
  status: SuggestionStatus;
  dateCreated: string; // ISO string
  dateUpdated: string; // ISO string
  dateCompleted?: string;
  notes: string;
  createdBy?: string;
};

export type SuggestionsData = {
  employees: Employee[];
  suggestions: Suggestion[];
};
