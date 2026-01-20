'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  InterviewSession,
  InterviewAction,
  InterviewInput,
  InterviewQuestion,
  AnswerFeedback,
} from '@/lib/interview-types';

const STORAGE_KEY = 'careerpath-interview';

const initialState: InterviewSession = {
  id: '',
  input: {
    jobDescription: '',
    resumeText: '',
    fileName: '',
  },
  questions: [],
  answers: [],
  currentQuestionIndex: 0,
  status: 'setup',
};

function interviewReducer(
  state: InterviewSession,
  action: InterviewAction
): InterviewSession {
  switch (action.type) {
    case 'SET_INPUT':
      return {
        ...state,
        input: { ...state.input, ...action.input },
      };

    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.questions,
        answers: [],
        currentQuestionIndex: 0,
      };

    case 'SET_ANSWER': {
      const existingIndex = state.answers.findIndex(
        (a) => a.questionId === action.questionId
      );
      const newAnswer = {
        questionId: action.questionId,
        answer: action.answer,
        timestamp: Date.now(),
      };

      let newAnswers;
      if (existingIndex >= 0) {
        newAnswers = [...state.answers];
        newAnswers[existingIndex] = {
          ...newAnswers[existingIndex],
          answer: action.answer,
          timestamp: Date.now(),
        };
      } else {
        newAnswers = [...state.answers, newAnswer];
      }

      return {
        ...state,
        answers: newAnswers,
      };
    }

    case 'SET_FEEDBACK': {
      const answerIndex = state.answers.findIndex(
        (a) => a.questionId === action.questionId
      );
      if (answerIndex < 0) return state;

      const newAnswers = [...state.answers];
      newAnswers[answerIndex] = {
        ...newAnswers[answerIndex],
        feedback: action.feedback,
      };

      return {
        ...state,
        answers: newAnswers,
      };
    }

    case 'SET_QUESTION_INDEX':
      return {
        ...state,
        currentQuestionIndex: action.index,
      };

    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
      };

    case 'START_SESSION':
      return {
        ...state,
        id: action.id,
        status: 'in_progress',
        currentQuestionIndex: 0,
        answers: [],
      };

    case 'RESET':
      return initialState;

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
}

interface InterviewContextType {
  session: InterviewSession;
  setInput: (input: Partial<InterviewInput>) => void;
  setQuestions: (questions: InterviewQuestion[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setFeedback: (questionId: string, feedback: AnswerFeedback) => void;
  setQuestionIndex: (index: number) => void;
  setStatus: (status: InterviewSession['status']) => void;
  startSession: (id: string) => void;
  reset: () => void;
  getCurrentQuestion: () => InterviewQuestion | null;
  getProgress: () => number;
  getAverageScore: () => number;
}

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

export function InterviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, dispatch] = useReducer(interviewReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: parsed });
      }
    } catch (error) {
      console.error('Failed to load interview state:', error);
    }
  }, []);

  // Save state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save interview state:', error);
    }
  }, [session]);

  const setInput = useCallback((input: Partial<InterviewInput>) => {
    dispatch({ type: 'SET_INPUT', input });
  }, []);

  const setQuestions = useCallback((questions: InterviewQuestion[]) => {
    dispatch({ type: 'SET_QUESTIONS', questions });
  }, []);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    dispatch({ type: 'SET_ANSWER', questionId, answer });
  }, []);

  const setFeedback = useCallback(
    (questionId: string, feedback: AnswerFeedback) => {
      dispatch({ type: 'SET_FEEDBACK', questionId, feedback });
    },
    []
  );

  const setQuestionIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_QUESTION_INDEX', index });
  }, []);

  const setStatus = useCallback((status: InterviewSession['status']) => {
    dispatch({ type: 'SET_STATUS', status });
  }, []);

  const startSession = useCallback((id: string) => {
    dispatch({ type: 'START_SESSION', id });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear interview state:', error);
    }
  }, []);

  const getCurrentQuestion = useCallback(() => {
    if (session.questions.length === 0) return null;
    return session.questions[session.currentQuestionIndex] || null;
  }, [session.questions, session.currentQuestionIndex]);

  const getProgress = useCallback(() => {
    if (session.questions.length === 0) return 0;
    const answeredCount = session.answers.filter((a) => a.feedback).length;
    return Math.round((answeredCount / session.questions.length) * 100);
  }, [session.questions.length, session.answers]);

  const getAverageScore = useCallback(() => {
    const answersWithFeedback = session.answers.filter((a) => a.feedback);
    if (answersWithFeedback.length === 0) return 0;
    const totalScore = answersWithFeedback.reduce(
      (sum, a) => sum + (a.feedback?.score || 0),
      0
    );
    return Math.round(totalScore / answersWithFeedback.length);
  }, [session.answers]);

  const value = useMemo(
    () => ({
      session,
      setInput,
      setQuestions,
      setAnswer,
      setFeedback,
      setQuestionIndex,
      setStatus,
      startSession,
      reset,
      getCurrentQuestion,
      getProgress,
      getAverageScore,
    }),
    [
      session,
      setInput,
      setQuestions,
      setAnswer,
      setFeedback,
      setQuestionIndex,
      setStatus,
      startSession,
      reset,
      getCurrentQuestion,
      getProgress,
      getAverageScore,
    ]
  );

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
