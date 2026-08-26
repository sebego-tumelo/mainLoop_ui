export interface PrizeDivision {
  match: number;
  label: string;
  winners: number;
  payout: number; // in ZAR
  percentage: string;
}

export interface DrawResult {
  id: string;
  drawNumber: number;
  date: string; // YYYY-MM-DD
  time: string;
  winningNumbers: number[]; // 5 sorted numbers between 1 and 36
  prizePool: number; // in ZAR
  divisions: PrizeDivision[];
}

export interface PredictionSet {
  id: string;
  setNumber: number;
  numbers: number[]; // 5 sorted numbers between 1 and 36
  confidenceScore?: number;
  matchedNumbers?: number[];
  winAmount?: number;
}

export interface PredictionRecord {
  id: string;
  createdAt: string;
  targetDrawDate: string;
  boardsCount: number;
  cost: number; // e.g. 3 * R3 = R9
  sets: PredictionSet[];
  status: 'pending' | 'evaluated';
  evaluatedDrawId?: string;
  totalWon: number;
  netProfit: number;
  topMatchCount: number;
}

export interface FinancialSummary {
  currentDrawCost: number;
  lifetimeSpent: number;
  lifetimeWon: number;
  netProfit: number;
  roiPercentage: number;
  totalDrawsEvaluated: number;
  winningDrawsCount: number;
  bestSingleWin: number;
}

export type ViewTab = 'draws' | 'predictions';
export type SortOrder = 'newest' | 'oldest';
