import type { Answer, Assessment } from '../types';
import { questions } from '../data/questions';

export function calculateScore(answers: Answer[]): Assessment {
  // Calculate total possible score
  const maxScore = questions.reduce((acc, q) => {
    const maxOptionScore = Math.max(...q.scores);
    return acc + (maxOptionScore * q.weight);
  }, 0);

  // Calculate user's score
  const userScore = answers.reduce((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return acc;
    const score = question.scores[answer.value - 1];
    return acc + (score * question.weight);
  }, 0);

  // Convert to 0-100 scale
  const normalizedScore = Math.round((userScore / maxScore) * 100);

  // Determine risk level
  let riskLevel: Assessment['riskLevel'];
  if (normalizedScore < 35) riskLevel = 'Conservative';
  else if (normalizedScore < 65) riskLevel = 'Moderate';
  else riskLevel = 'Aggressive';

  const recommendations = generateRecommendations(normalizedScore, answers);

  return {
    score: normalizedScore,
    riskLevel,
    recommendations
  };
}

function generateRecommendations(score: number, answers: Answer[]): string[] {
  const recommendations: string[] = [];

  if (score < 35) {
    recommendations.push(
      'Consider a portfolio focused on capital preservation with high-quality bonds and dividend stocks',
      'Maintain a larger emergency fund for financial security',
      'Look into Principal Protection Accounts to ensure safety of principal',
      'Focus on stable, income-producing investments'
    );
  } else if (score < 65) {
    recommendations.push(
      'Consider a balanced portfolio with a mix of stocks and bonds',
      'Diversify across multiple asset classes including Principal Protection Accounts',
      'Look into index funds for steady market exposure',
      'Maintain a moderate emergency fund while pursuing growth opportunities'
    );
  } else {
    recommendations.push(
      'Consider a growth-oriented portfolio with higher allocation to stocks',
      'Look into emerging markets and small-cap investments for higher potential returns',
      'Consider Principal Protection Accounts to help offset downside risk',
      'Be prepared for higher volatility while pursuing long-term growth'
    );
  }

  return recommendations;
}