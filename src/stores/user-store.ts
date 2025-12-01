import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ExamType, MembershipTier } from "@/types";

interface UserState {
  // User settings
  targetExam: ExamType | null;
  targetDate: Date | null;
  targetScore: number | null;
  membership: MembershipTier;

  // Study progress
  dailyGoal: number;
  todaySolved: number;
  currentStreak: number;

  // UI preferences
  theme: "light" | "dark" | "system";
  showHints: boolean;
  autoNextQuestion: boolean;
  soundEnabled: boolean;

  // Actions
  setTargetExam: (exam: ExamType) => void;
  setTargetDate: (date: Date) => void;
  setTargetScore: (score: number) => void;
  setDailyGoal: (goal: number) => void;
  incrementTodaySolved: () => void;
  resetDailySolved: () => void;
  setCurrentStreak: (streak: number) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleHints: () => void;
  toggleAutoNext: () => void;
  toggleSound: () => void;
  setMembership: (tier: MembershipTier) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      targetExam: null,
      targetDate: null,
      targetScore: null,
      membership: "free",
      dailyGoal: 30,
      todaySolved: 0,
      currentStreak: 0,
      theme: "system",
      showHints: true,
      autoNextQuestion: false,
      soundEnabled: true,

      // Actions
      setTargetExam: (exam) => set({ targetExam: exam }),
      setTargetDate: (date) => set({ targetDate: date }),
      setTargetScore: (score) => set({ targetScore: score }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      incrementTodaySolved: () =>
        set((state) => ({ todaySolved: state.todaySolved + 1 })),
      resetDailySolved: () => set({ todaySolved: 0 }),
      setCurrentStreak: (streak) => set({ currentStreak: streak }),
      setTheme: (theme) => set({ theme }),
      toggleHints: () => set((state) => ({ showHints: !state.showHints })),
      toggleAutoNext: () =>
        set((state) => ({ autoNextQuestion: !state.autoNextQuestion })),
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      setMembership: (tier) => set({ membership: tier }),
    }),
    {
      name: "examforge-user",
      partialize: (state) => ({
        targetExam: state.targetExam,
        targetDate: state.targetDate,
        targetScore: state.targetScore,
        dailyGoal: state.dailyGoal,
        theme: state.theme,
        showHints: state.showHints,
        autoNextQuestion: state.autoNextQuestion,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
