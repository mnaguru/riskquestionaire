export interface Question {
  id: string;
  text: string;
  type: 'choice';
  options: readonly string[];
  scores: readonly number[];
  weight: number;
}

export interface Answer {
  questionId: string;
  value: number;
}

export interface Assessment {
  score: number;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  recommendations: string[];
}

export interface FinancialProfile {
  age: string;
  income: string;
  properties: string[];
  hasAlternativeInvestments: boolean;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}