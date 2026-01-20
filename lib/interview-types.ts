export type QuestionCategory = 'behavioral' | 'technical' | 'situational' | 'cultural';

export interface InterviewQuestion {
  id: string;
  text: string;
  category: QuestionCategory;
  context?: string;
  skillsAssessed?: string[];
}

export interface InterviewInput {
  jobDescription: string;
  resumeText: string;
  fileName?: string;
}

export interface AnswerFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
  starAnalysis?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
}

export interface AnswerRecord {
  questionId: string;
  answer: string;
  feedback?: AnswerFeedback;
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  input: InterviewInput;
  questions: InterviewQuestion[];
  answers: AnswerRecord[];
  currentQuestionIndex: number;
  status: 'setup' | 'in_progress' | 'completed';
}

export type InterviewAction =
  | { type: 'SET_INPUT'; input: Partial<InterviewInput> }
  | { type: 'SET_QUESTIONS'; questions: InterviewQuestion[] }
  | { type: 'SET_ANSWER'; questionId: string; answer: string }
  | { type: 'SET_FEEDBACK'; questionId: string; feedback: AnswerFeedback }
  | { type: 'SET_QUESTION_INDEX'; index: number }
  | { type: 'SET_STATUS'; status: InterviewSession['status'] }
  | { type: 'START_SESSION'; id: string }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; state: Partial<InterviewSession> };
