
export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type Operator = '+' | '-' | '*' | '/' | null;
