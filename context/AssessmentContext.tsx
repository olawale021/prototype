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
  AssessmentState,
  AssessmentAction,
  UserAnswers,
  AnswerValue,
} from '@/lib/types';
import { questions } from '@/lib/questions';

const STORAGE_KEY = 'careerpath-assessment';

const initialState: AssessmentState = {
  answers: {},
  currentStep: 0,
  isComplete: false,
};

function assessmentReducer(
  state: AssessmentState,
  action: AssessmentAction
): AssessmentState {
  switch (action.type) {
    case 'SET_ANSWER':
      const newAnswers = {
        ...state.answers,
        [action.questionId]: action.value,
      };
      const requiredQuestions = questions.filter((q) => q.required);
      const answeredRequired = requiredQuestions.filter(
        (q) => newAnswers[q.id] !== undefined && newAnswers[q.id] !== null
      );
      const isComplete = answeredRequired.length === requiredQuestions.length;

      return {
        ...state,
        answers: newAnswers,
        isComplete,
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.step,
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

interface AssessmentContextType {
  state: AssessmentState;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  setStep: (step: number) => void;
  reset: () => void;
  getProgress: () => number;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export function AssessmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', state: parsed });
      }
    } catch (error) {
      console.error('Failed to load assessment state:', error);
    }
  }, []);

  // Save state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save assessment state:', error);
    }
  }, [state]);

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    dispatch({ type: 'SET_ANSWER', questionId, value });
  }, []);

  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear assessment state:', error);
    }
  }, []);

  const getProgress = useCallback(() => {
    const requiredQuestions = questions.filter((q) => q.required);
    const answeredRequired = requiredQuestions.filter(
      (q) =>
        state.answers[q.id] !== undefined && state.answers[q.id] !== null
    );
    return Math.round((answeredRequired.length / requiredQuestions.length) * 100);
  }, [state.answers]);

  const value = useMemo(
    () => ({
      state,
      setAnswer,
      setStep,
      reset,
      getProgress,
    }),
    [state, setAnswer, setStep, reset, getProgress]
  );

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
