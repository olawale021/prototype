import { CareerPath, CareerRecommendation, UserAnswers } from './types';
import { careerPaths } from './careers';
import { questions } from './questions';

interface ScoreContribution {
  questionId: string;
  questionText: string;
  answerValue: string | string[] | number;
  contribution: number;
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
    experience_background: (answer) => {
      const bg = answer as string;
      const bgLabels: Record<string, string> = {
        student: 'Your fresh perspective as a student/new grad',
        early_career: 'Your early career experience',
        mid_career: 'Your solid mid-career experience',
        senior: 'Your extensive senior-level experience',
        career_changer: 'Your career change journey brings fresh perspective',
      };
      return bgLabels[bg] ? `${bgLabels[bg]} fits well` : null;
    },
    education_level: (answer) => {
      const level = answer as string;
      if (level === 'graduate') return 'Your advanced education is highly valued';
      if (level === 'bachelors') return "Your bachelor's degree provides a strong foundation";
      return null;
    },
    skill_strengths: (answer) => {
      const skills = answer as string[];
      if (skills.includes('technical')) return 'Your strong technical skills are highly valued';
      if (skills.includes('communication')) return 'Your communication skills are essential for success';
      if (skills.includes('creative')) return 'Your creativity aligns well with this role';
      if (skills.includes('leadership')) return 'Your leadership abilities are key for this path';
      if (skills.includes('research')) return 'Your research skills are a great asset';
      return null;
    },
    field_of_study: (answer) => {
      const field = answer as string;
      const fieldLabels: Record<string, string> = {
        computer_science: 'Your CS/IT background',
        engineering: 'Your engineering background',
        business: 'Your business education',
        finance_accounting: 'Your finance background',
        healthcare_medicine: 'Your healthcare education',
        science: 'Your science background',
        arts_humanities: 'Your arts background',
        social_sciences: 'Your social sciences education',
        education: 'Your education background',
        law: 'Your legal studies',
        design_media: 'Your design/media education',
        trades_vocational: 'Your vocational training',
      };
      return fieldLabels[field] ? `${fieldLabels[field]} is a great match` : null;
    },
    enjoyed_skills: (answer) => {
      const skills = answer as string[];
      if (skills.includes('coding')) return 'You enjoy coding and technical work';
      if (skills.includes('leadership')) return 'Your leadership interest is valued here';
      if (skills.includes('design')) return 'Your passion for design fits this path';
      if (skills.includes('data_analysis')) return 'You enjoy working with data and analysis';
      if (skills.includes('problem_solving')) return 'Your problem-solving passion is key';
      if (skills.includes('presenting')) return 'Your presentation skills will shine';
      if (skills.includes('teaching')) return 'Your passion for teaching and mentoring fits well';
      if (skills.includes('customer_service')) return 'Your customer service skills are valuable here';
      if (skills.includes('hands_on_work')) return 'Your hands-on skills are essential for this path';
      if (skills.includes('healthcare')) return 'Your healthcare and patient care skills align perfectly';
      if (skills.includes('styling')) return 'Your styling and aesthetics sense fits this industry';
      if (skills.includes('legal_policy')) return 'Your legal and policy analysis skills are key';
      if (skills.includes('scientific_lab')) return 'Your scientific and lab work experience is valued';
      if (skills.includes('event_planning')) return 'Your event planning skills are a great match';
      if (skills.includes('writing')) return 'Your writing skills are a great asset';
      if (skills.includes('research')) return 'Your research skills are highly valued';
      if (skills.includes('collaboration')) return 'You excel at team collaboration';
      if (skills.includes('negotiation')) return 'Your negotiation skills are a strong match';
      return null;
    },
    work_energizes: (answer) => {
      const activities = answer as string[];
      if (activities.includes('building')) return 'You thrive when building new things';
      if (activities.includes('strategizing')) return 'You enjoy strategic thinking';
      if (activities.includes('creating')) return 'Creating content energizes you';
      if (activities.includes('analyzing')) return 'Analytical work motivates you';
      if (activities.includes('helping')) return 'Helping others drives your work';
      if (activities.includes('connecting')) return 'You thrive on connecting with people';
      if (activities.includes('optimizing')) return 'You enjoy optimizing and improving processes';
      if (activities.includes('learning')) return 'Your love of learning fits well';
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
    industry_interest: (answer) => {
      const interest = answer as string;
      if (interest === 'other') {
        return "You're interested in exploring unique industry paths";
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
    work_style: (answer) => {
      const style = answer as string;
      const styleLabels: Record<string, string> = {
        independent: 'independent and flexible work',
        collaborative: 'collaborative team environments',
        structured: 'structured corporate settings',
        dynamic: 'dynamic startup environments',
        mission_driven: 'mission-driven organizations',
      };
      return `Your preference for ${styleLabels[style] || style} aligns well`;
    },
    career_priority: (answer) => {
      const priority = answer as string;
      const priorityLabels: Record<string, string> = {
        compensation: 'high earning potential',
        balance: 'work-life balance',
        growth: 'continuous learning and growth',
        impact: 'meaningful impact',
        security: 'job stability and security',
      };
      return priorityLabels[priority] ? `This path offers ${priorityLabels[priority]}` : null;
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
