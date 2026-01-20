import { CareerPath, CareerRecommendation, UserAnswers } from './types';
import { careerPaths } from './careers';
import { questions } from './questions';

interface ScoreContribution {
  questionId: string;
  questionText: string;
  answerValue: string | string[] | number;
  contribution: number;
}

function getSliderLevel(value: number, max: number): 'low' | 'medium' | 'high' {
  const normalized = value / max;
  if (normalized <= 0.33) return 'low';
  if (normalized <= 0.66) return 'medium';
  return 'high';
}

function calculateCareerScore(
  career: CareerPath,
  answers: UserAnswers
): { score: number; contributions: ScoreContribution[] } {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const contributions: ScoreContribution[] = [];

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    const weights = career.weights[question.id];
    if (!weights) continue;

    let questionScore = 0;
    let questionMaxScore = 0;

    switch (question.type) {
      case 'slider': {
        const numericAnswer = Number(answer);
        const max = question.max || 10;
        const level = getSliderLevel(numericAnswer, max);

        const levelWeights = weights as Record<string, number>;
        const maxWeight = Math.max(
          levelWeights.low || 0,
          levelWeights.medium || 0,
          levelWeights.high || 0
        );

        questionScore = levelWeights[level] || 0;
        questionMaxScore = maxWeight;
        break;
      }

      case 'multiple-choice': {
        const selectedValue = answer as string;
        const optionWeights = weights as Record<string, number>;
        const maxWeight = Math.max(...Object.values(optionWeights));

        questionScore = optionWeights[selectedValue] || 0;
        questionMaxScore = maxWeight;
        break;
      }

      case 'multi-select': {
        const selectedValues = answer as string[];
        const optionWeights = weights as Record<string, number>;
        const maxWeight = Math.max(...Object.values(optionWeights));

        for (const value of selectedValues) {
          questionScore += optionWeights[value] || 0;
        }

        // Cap multi-select contribution and normalize
        const cappedScore = Math.min(questionScore, maxWeight * 2);
        questionScore = cappedScore;
        questionMaxScore = maxWeight * 2;
        break;
      }
    }

    if (questionScore > 0) {
      contributions.push({
        questionId: question.id,
        questionText: question.question,
        answerValue: answer,
        contribution: questionScore,
      });
    }

    totalScore += questionScore;
    maxPossibleScore += questionMaxScore;
  }

  // Normalize score
  const normalizedScore = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0;

  return { score: normalizedScore, contributions };
}

function generateReasons(
  career: CareerPath,
  contributions: ScoreContribution[]
): string[] {
  const reasons: string[] = [];

  // Sort contributions by their contribution value
  const sortedContributions = [...contributions].sort(
    (a, b) => b.contribution - a.contribution
  );

  // Take top 3-4 contributing factors
  const topContributions = sortedContributions.slice(0, 4);

  for (const contribution of topContributions) {
    const reason = generateReasonText(contribution, career);
    if (reason) {
      reasons.push(reason);
    }
  }

  // Ensure we have at least 2 reasons
  if (reasons.length < 2) {
    reasons.push(`Good match for your background and interests`);
  }

  return reasons.slice(0, 4);
}

function generateReasonText(
  contribution: ScoreContribution,
  career: CareerPath
): string | null {
  const { questionId, answerValue } = contribution;

  const reasonMappings: Record<string, (answer: string | string[] | number) => string | null> = {
    technical_skills: (answer) => {
      const level = getSliderLevel(Number(answer), 10);
      if (level === 'high') return 'Your strong technical skills are highly valued';
      if (level === 'medium') return 'Your technical abilities are a good foundation';
      return null;
    },
    creative_skills: (answer) => {
      const level = getSliderLevel(Number(answer), 10);
      if (level === 'high') return 'Your creativity aligns well with this role';
      return null;
    },
    communication_skills: (answer) => {
      const level = getSliderLevel(Number(answer), 10);
      if (level === 'high') return 'Your communication skills are essential for success';
      return null;
    },
    enjoyed_skills: (answer) => {
      const skills = answer as string[];
      if (skills.includes('coding')) return 'You enjoy coding and technical work';
      if (skills.includes('leadership')) return 'Your leadership interest is valued here';
      if (skills.includes('design')) return 'Your passion for design fits this path';
      if (skills.includes('data_analysis')) return 'You enjoy working with data and analysis';
      if (skills.includes('problem_solving')) return 'Your problem-solving passion is key';
      if (skills.includes('presenting')) return 'Your presentation skills will shine';
      return null;
    },
    work_energizes: (answer) => {
      const activities = answer as string[];
      if (activities.includes('building')) return 'You thrive when building new things';
      if (activities.includes('strategizing')) return 'You enjoy strategic thinking';
      if (activities.includes('creating')) return 'Creating content energizes you';
      if (activities.includes('analyzing')) return 'Analytical work motivates you';
      if (activities.includes('helping')) return 'Helping others drives your work';
      return null;
    },
    problem_type: (answer) => {
      const type = answer as string;
      const typeLabels: Record<string, string> = {
        technical: 'solving technical challenges',
        people: 'navigating people-related challenges',
        business: 'tackling business problems',
        creative: 'addressing creative challenges',
        analytical: 'diving into analytical problems',
      };
      return `You prefer ${typeLabels[type] || type}`;
    },
    work_environment: (answer) => {
      const env = answer as string;
      const envLabels: Record<string, string> = {
        startup: 'startup environments',
        corporate: 'corporate settings',
        agency: 'agency work',
        consulting: 'consulting roles',
        freelance: 'independent work',
        nonprofit: 'mission-driven organizations',
      };
      return `Your preference for ${envLabels[env] || env} aligns well`;
    },
    structure_preference: (answer) => {
      const level = getSliderLevel(Number(answer), 10);
      if (level === 'low') return 'You thrive with flexibility and autonomy';
      if (level === 'high') return 'You work well in structured environments';
      return null;
    },
    industry_interest: (answer) => {
      const interest = answer as string;
      if (interest === 'other') {
        return 'You're interested in exploring unique industry paths';
      }
      const interestLabels: Record<string, string> = {
        technology_engineering: 'technology and engineering',
        business_management: 'business and management',
        finance_accounting: 'finance and accounting',
        healthcare_life_sciences: 'healthcare and life sciences',
        education_training: 'education and training',
        creative_media_design: 'creative and media design',
        marketing_sales: 'marketing and sales',
        law_government: 'law and government',
        science_research: 'science and research',
        manufacturing_construction: 'manufacturing and construction',
        hospitality_service: 'hospitality and service',
        social_impact_nonprofit: 'social impact and nonprofit',
        beauty_fashion: 'beauty, fashion and lifestyle',
      };
      return `Your interest in ${interestLabels[interest] || interest} fits perfectly`;
    },
  };

  const reasonGenerator = reasonMappings[questionId];
  if (reasonGenerator) {
    return reasonGenerator(answerValue);
  }

  return null;
}

export function getRecommendations(answers: UserAnswers): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  for (const career of careerPaths) {
    const { score, contributions } = calculateCareerScore(career, answers);
    const reasons = generateReasons(career, contributions);

    recommendations.push({
      career,
      score,
      percentage: Math.round(score * 100),
      reasons,
    });
  }

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  // Return top 3
  return recommendations.slice(0, 3);
}

export function getAllRecommendations(answers: UserAnswers): CareerRecommendation[] {
  const recommendations: CareerRecommendation[] = [];

  for (const career of careerPaths) {
    const { score, contributions } = calculateCareerScore(career, answers);
    const reasons = generateReasons(career, contributions);

    recommendations.push({
      career,
      score,
      percentage: Math.round(score * 100),
      reasons,
    });
  }

  // Sort by score descending
  recommendations.sort((a, b) => b.score - a.score);

  return recommendations;
}
