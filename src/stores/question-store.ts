import { create } from "zustand";
import type { Question, QuestionOption } from "@/types";

interface QuestionState {
  // Current question session
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | string[]>;
  timeStarted: Date | null;
  timePerQuestion: Record<string, number>;

  // Results
  results: {
    questionId: string;
    isCorrect: boolean;
    userAnswer: string | string[];
    timeSpent: number;
  }[];

  // Session settings
  sessionType: "practice" | "mock_exam" | "review";
  shuffleOptions: boolean;
  showExplanationImmediately: boolean;

  // Bookmarks and flags
  bookmarkedQuestions: Set<string>;
  flaggedQuestions: Set<string>;

  // Actions
  setQuestions: (questions: Question[]) => void;
  setCurrentIndex: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  submitAnswer: (questionId: string, isCorrect: boolean, timeSpent: number) => void;
  startSession: (type: "practice" | "mock_exam" | "review") => void;
  endSession: () => void;
  toggleBookmark: (questionId: string) => void;
  toggleFlag: (questionId: string) => void;
  resetSession: () => void;
  getCurrentQuestion: () => Question | null;
  getProgress: () => { current: number; total: number; percentage: number };
  getAccuracy: () => number;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  // Initial state
  questions: [],
  currentIndex: 0,
  answers: {},
  timeStarted: null,
  timePerQuestion: {},
  results: [],
  sessionType: "practice",
  shuffleOptions: true,
  showExplanationImmediately: true,
  bookmarkedQuestions: new Set(),
  flaggedQuestions: new Set(),

  // Actions
  setQuestions: (questions) => set({ questions, currentIndex: 0 }),

  setCurrentIndex: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  setAnswer: (questionId, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    }));
  },

  submitAnswer: (questionId, isCorrect, timeSpent) => {
    const { answers } = get();
    const userAnswer = answers[questionId] || "";

    set((state) => ({
      results: [
        ...state.results,
        { questionId, isCorrect, userAnswer, timeSpent },
      ],
      timePerQuestion: {
        ...state.timePerQuestion,
        [questionId]: timeSpent,
      },
    }));
  },

  startSession: (type) => {
    set({
      sessionType: type,
      timeStarted: new Date(),
      answers: {},
      results: [],
      timePerQuestion: {},
      currentIndex: 0,
    });
  },

  endSession: () => {
    set({ timeStarted: null });
  },

  toggleBookmark: (questionId) => {
    set((state) => {
      const newBookmarks = new Set(state.bookmarkedQuestions);
      if (newBookmarks.has(questionId)) {
        newBookmarks.delete(questionId);
      } else {
        newBookmarks.add(questionId);
      }
      return { bookmarkedQuestions: newBookmarks };
    });
  },

  toggleFlag: (questionId) => {
    set((state) => {
      const newFlags = new Set(state.flaggedQuestions);
      if (newFlags.has(questionId)) {
        newFlags.delete(questionId);
      } else {
        newFlags.add(questionId);
      }
      return { flaggedQuestions: newFlags };
    });
  },

  resetSession: () => {
    set({
      questions: [],
      currentIndex: 0,
      answers: {},
      timeStarted: null,
      timePerQuestion: {},
      results: [],
      flaggedQuestions: new Set(),
    });
  },

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] || null;
  },

  getProgress: () => {
    const { currentIndex, questions } = get();
    const total = questions.length;
    return {
      current: currentIndex + 1,
      total,
      percentage: total > 0 ? ((currentIndex + 1) / total) * 100 : 0,
    };
  },

  getAccuracy: () => {
    const { results } = get();
    if (results.length === 0) return 0;
    const correct = results.filter((r) => r.isCorrect).length;
    return (correct / results.length) * 100;
  },
}));
