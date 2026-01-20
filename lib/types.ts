export type QuestionCategory = 'background' | 'skills' | 'interests' | 'preferences' | 'goals';

export type QuestionType = 'multiple-choice' | 'multi-select' | 'slider' | 'text';

export interface Option {
  value: string;
  label: string;
  weight?: number;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  type: QuestionType;
  question: string;
  description?: string;
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  required: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  weights: Record<string, Record<string, number>>;
  suggestedSkills: string[];
  exampleJobs: string[];
  resources: Resource[];
}

export interface Resource {
  title: string;
  url: string;
}

export type AnswerValue = string | string[] | number;

export interface UserAnswers {
  [questionId: string]: AnswerValue;
}

export interface CareerRecommendation {
  career: CareerPath;
  score: number;
  percentage: number;
  reasons: string[];
}

export interface AssessmentState {
  answers: UserAnswers;
  currentStep: number;
  isComplete: boolean;
}

export type AssessmentAction =
  | { type: 'SET_ANSWER'; questionId: string; value: AnswerValue }
  | { type: 'SET_STEP'; step: number }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; state: Partial<AssessmentState> };
