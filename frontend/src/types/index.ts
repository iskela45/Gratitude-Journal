export interface Entry {
  id: number;
  date: string;        // ISO date string: "2026-03-05"
  content: string;
  created_at: string;
  updated_at: string;
}

export interface EntryPayload {
  date: string;
  content: string;
}

export interface MonthCount {
  month: string;       // "2026-03"
  count: number;
}

export interface Stats {
  total: number;
  current_streak: number;
  longest_streak: number;
  entries_per_month: MonthCount[];
}
