export interface OptionMeta {
  [key: string]: any;
}

export interface Option {
  id: string;
  label: string;
  meta: OptionMeta;
}

export interface Criterion {
  id: string;
  label: string;
  weight: number;
}

export interface ScoreBreakdown {
  label: string;
  rawScore: number;
  weight: number;
  weightedScore: number;
}

export interface CalculationResult {
  id: string;
  label: string;
  totalScore: number;
  weightedScore: number;
  normalizedScore: number;
  breakdown: Record<string, ScoreBreakdown>;
}

export interface RankingEntry {
  rank: number;
  id: string;
  label: string;
  weightedScore: number;
  normalizedScore: number;
}

export interface MatrixJSON {
  name: string;
  options: Option[];
  criteria: Criterion[];
  scores: Record<string, Record<string, number>>;
}

export declare class DecisionMatrix {
  name: string;
  options: Option[];
  criteria: Criterion[];
  scores: Record<string, Record<string, number>>;

  constructor(name?: string);

  addOption(id: string, label: string, meta?: OptionMeta): DecisionMatrix;
  addCriteria(id: string, label: string, weight?: number): DecisionMatrix;
  setWeight(criteriaId: string, weight: number): DecisionMatrix;
  score(optionId: string, criteriaId: string, score: number): DecisionMatrix;
  calculate(): CalculationResult[];
  getBestOption(): CalculationResult;
  getRanking(): RankingEntry[];
  toJSON(): MatrixJSON;
  print(): void;

  static fromJSON(data: MatrixJSON): DecisionMatrix;
}
