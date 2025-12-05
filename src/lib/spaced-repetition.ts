/**
 * SM-2 Spaced Repetition Algorithm
 * Based on the SuperMemo 2 algorithm used by Anki
 */

import { SpacedRepetitionQuality } from "@/types";

interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
}

interface SM2Input {
  quality: SpacedRepetitionQuality; // 0-5 rating
  easeFactor: number; // Default 2.5
  interval: number; // Days
  repetitions: number;
}

/**
 * Calculate the next review parameters using SM-2 algorithm
 *
 * Quality ratings:
 * 0 - Complete blackout, didn't remember at all
 * 1 - Wrong answer, but upon seeing the answer, remembered
 * 2 - Wrong answer, but the correct answer seemed easy to recall
 * 3 - Correct answer, but with significant difficulty
 * 4 - Correct answer, with some hesitation
 * 5 - Correct answer, perfect recall
 */
export function calculateSM2({
  quality,
  easeFactor,
  interval,
  repetitions,
}: SM2Input): SM2Result {
  // If quality < 3, start over (failed to recall)
  if (quality < 3) {
    return {
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      interval: 1, // Reset to 1 day
      repetitions: 0,
      nextReviewDate: addDays(new Date(), 1),
    };
  }

  // Calculate new ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate new interval
  let newInterval: number;
  if (repetitions === 0) {
    newInterval = 1;
  } else if (repetitions === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  // Add some randomness (fuzz factor) to prevent clustering
  const fuzz = Math.round(newInterval * 0.05);
  const fuzzedInterval = newInterval + Math.floor(Math.random() * (fuzz * 2 + 1)) - fuzz;

  return {
    easeFactor: newEaseFactor,
    interval: Math.max(1, fuzzedInterval),
    repetitions: repetitions + 1,
    nextReviewDate: addDays(new Date(), fuzzedInterval),
  };
}

/**
 * Convert answer correctness and time to quality rating
 */
export function answerToQuality(
  isCorrect: boolean,
  timeSpent: number,
  expectedTime: number,
  confidence?: "low" | "medium" | "high"
): SpacedRepetitionQuality {
  if (!isCorrect) {
    // Wrong answer
    if (confidence === "high") return 0; // Confident but wrong - complete blackout
    return 1; // Regular wrong answer
  }

  // Correct answer
  const timeRatio = timeSpent / expectedTime;

  if (timeRatio > 2) {
    // Took much longer than expected
    return 3; // Correct with significant difficulty
  } else if (timeRatio > 1) {
    // Took a bit longer
    return confidence === "high" ? 4 : 3;
  } else {
    // Fast answer
    return confidence === "high" ? 5 : 4;
  }
}

/**
 * Get recommended review count for today
 */
export function getReviewRecommendation(
  totalDueCards: number,
  dailyLimit: number = 50,
  newCardsLimit: number = 20
): {
  reviewCount: number;
  newCount: number;
  message: string;
} {
  const reviewCount = Math.min(totalDueCards, dailyLimit);

  let message = "";
  if (totalDueCards > dailyLimit) {
    message = `오늘 복습할 카드가 ${totalDueCards}개 있습니다. 최대 ${dailyLimit}개까지 복습 권장합니다.`;
  } else if (totalDueCards > 0) {
    message = `오늘 복습할 카드가 ${totalDueCards}개 있습니다.`;
  } else {
    message = "오늘 복습할 카드가 없습니다. 새로운 문제를 학습해보세요!";
  }

  return {
    reviewCount,
    newCount: newCardsLimit,
    message,
  };
}

/**
 * Calculate retention forecast
 */
export function calculateRetention(
  easeFactor: number,
  daysSinceReview: number,
  interval: number
): number {
  // Using a simple exponential decay model
  // R = e^(-t/S) where S is stability (related to interval and ease factor)
  const stability = interval * easeFactor * 0.9;
  const retention = Math.exp(-daysSinceReview / stability) * 100;
  return Math.max(0, Math.min(100, retention));
}

/**
 * Get difficulty level label
 */
export function getDifficultyLabel(easeFactor: number): {
  label: string;
  color: string;
} {
  if (easeFactor >= 2.5) {
    return { label: "쉬움", color: "green" };
  } else if (easeFactor >= 2.0) {
    return { label: "보통", color: "yellow" };
  } else if (easeFactor >= 1.6) {
    return { label: "어려움", color: "orange" };
  } else {
    return { label: "매우 어려움", color: "red" };
  }
}

/**
 * Helper function to add days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days === 0) return "오늘";
  if (days === 1) return "내일";
  if (days < 7) return `${days}일 후`;
  if (days < 30) return `${Math.round(days / 7)}주 후`;
  if (days < 365) return `${Math.round(days / 30)}개월 후`;
  return `${Math.round(days / 365)}년 후`;
}
