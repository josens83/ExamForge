/**
 * Adaptive Learning Path Algorithm
 * Personalizes learning path based on user performance and goals
 */

import { Subject, Difficulty, Question, SubjectStat, WeakTopic } from "@/types";

interface UserPerformance {
  subject: Subject;
  totalSolved: number;
  correctCount: number;
  avgTimePerQuestion: number;
  recentAccuracy: number; // Last 20 questions
  difficultyDistribution: Record<Difficulty, { solved: number; correct: number }>;
}

interface LearningPath {
  recommendedSubjects: Subject[];
  dailyGoal: {
    totalQuestions: number;
    bySubject: { subject: Subject; count: number; priority: "high" | "medium" | "low" }[];
  };
  focusAreas: WeakTopic[];
  difficultyProgression: Difficulty;
  estimatedStudyTime: number; // minutes
}

interface AdaptiveConfig {
  targetExam: string;
  targetDate: Date;
  dailyStudyHours: number;
  preferredDifficulty?: Difficulty;
}

/**
 * Calculate Zone of Proximal Development (ZPD)
 * The optimal difficulty range for learning
 */
function calculateZPD(performance: UserPerformance): {
  minDifficulty: Difficulty;
  maxDifficulty: Difficulty;
  optimalDifficulty: Difficulty;
} {
  const accuracy = performance.correctCount / Math.max(1, performance.totalSolved);

  // If accuracy is high (>80%), increase difficulty
  // If accuracy is low (<50%), decrease difficulty
  let optimal: Difficulty = 3;

  if (accuracy >= 0.85) {
    optimal = 4;
  } else if (accuracy >= 0.70) {
    optimal = 3;
  } else if (accuracy >= 0.50) {
    optimal = 2;
  } else {
    optimal = 1;
  }

  // Consider recent performance for fine-tuning
  if (performance.recentAccuracy >= 0.90 && optimal < 5) {
    optimal = (optimal + 1) as Difficulty;
  } else if (performance.recentAccuracy < 0.40 && optimal > 1) {
    optimal = (optimal - 1) as Difficulty;
  }

  return {
    minDifficulty: Math.max(1, optimal - 1) as Difficulty,
    maxDifficulty: Math.min(5, optimal + 1) as Difficulty,
    optimalDifficulty: optimal,
  };
}

/**
 * Identify weak topics that need attention
 */
function identifyWeakTopics(
  subjectStats: SubjectStat[],
  recentMistakes: { topic: string; subject: Subject; count: number }[]
): WeakTopic[] {
  const weakTopics: WeakTopic[] = [];

  // From subject stats
  for (const stat of subjectStats) {
    if (stat.accuracy < 0.6 && stat.totalSolved >= 10) {
      weakTopics.push({
        subject: stat.subject,
        topic: "전체",
        accuracy: stat.accuracy * 100,
        totalAttempts: stat.totalSolved,
        recommendedQuestions: [],
        priority: stat.accuracy < 0.4 ? "high" : stat.accuracy < 0.5 ? "medium" : "low",
      });
    }
  }

  // From recent mistakes
  for (const mistake of recentMistakes) {
    if (mistake.count >= 3) {
      const existing = weakTopics.find(
        (w) => w.subject === mistake.subject && w.topic === mistake.topic
      );

      if (!existing) {
        weakTopics.push({
          subject: mistake.subject,
          topic: mistake.topic,
          accuracy: 0, // Will be calculated
          totalAttempts: mistake.count,
          recommendedQuestions: [],
          priority: mistake.count >= 5 ? "high" : "medium",
        });
      }
    }
  }

  // Sort by priority and accuracy
  return weakTopics.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.accuracy - b.accuracy;
  });
}

/**
 * Generate personalized learning path
 */
export function generateLearningPath(
  performances: UserPerformance[],
  config: AdaptiveConfig,
  subjectStats: SubjectStat[],
  recentMistakes: { topic: string; subject: Subject; count: number }[]
): LearningPath {
  // Calculate days until exam
  const daysUntilExam = Math.max(
    1,
    Math.ceil((config.targetDate.getTime() - Date.now()) / 86400000)
  );

  // Identify weak topics
  const weakTopics = identifyWeakTopics(subjectStats, recentMistakes);

  // Calculate recommended questions per day
  const questionsPerDay = Math.round(config.dailyStudyHours * 30); // ~2 min per question

  // Distribute questions by subject based on weakness and exam weight
  const subjectDistribution: { subject: Subject; count: number; priority: "high" | "medium" | "low" }[] = [];

  // Priority 1: Weak subjects (40% of time)
  const weakSubjects = performances
    .filter((p) => p.correctCount / Math.max(1, p.totalSolved) < 0.6)
    .sort((a, b) =>
      a.correctCount / Math.max(1, a.totalSolved) -
      b.correctCount / Math.max(1, b.totalSolved)
    );

  const weakQuestions = Math.round(questionsPerDay * 0.4);
  let remaining = weakQuestions;

  for (const weak of weakSubjects.slice(0, 3)) {
    const count = Math.ceil(remaining / (3 - subjectDistribution.length));
    subjectDistribution.push({
      subject: weak.subject,
      count,
      priority: "high",
    });
    remaining -= count;
  }

  // Priority 2: Maintaining subjects (40% of time)
  const maintainQuestions = Math.round(questionsPerDay * 0.4);
  const maintainSubjects = performances.filter(
    (p) =>
      p.correctCount / Math.max(1, p.totalSolved) >= 0.6 &&
      !weakSubjects.includes(p)
  );

  remaining = maintainQuestions;
  for (const maintain of maintainSubjects.slice(0, 3)) {
    const count = Math.ceil(remaining / Math.max(1, 3 - (subjectDistribution.length - weakSubjects.length)));
    subjectDistribution.push({
      subject: maintain.subject,
      count: Math.max(5, count),
      priority: "medium",
    });
    remaining -= count;
  }

  // Priority 3: Review and new content (20% of time)
  const reviewQuestions = Math.round(questionsPerDay * 0.2);

  // Calculate optimal difficulty
  const avgPerformance = performances.reduce(
    (acc, p) => ({
      totalSolved: acc.totalSolved + p.totalSolved,
      correctCount: acc.correctCount + p.correctCount,
      recentAccuracy: acc.recentAccuracy + p.recentAccuracy,
    }),
    { totalSolved: 0, correctCount: 0, recentAccuracy: 0 }
  );

  avgPerformance.recentAccuracy /= Math.max(1, performances.length);

  const zpd = calculateZPD({
    subject: "korean" as Subject,
    totalSolved: avgPerformance.totalSolved,
    correctCount: avgPerformance.correctCount,
    avgTimePerQuestion: 0,
    recentAccuracy: avgPerformance.recentAccuracy,
    difficultyDistribution: {} as Record<Difficulty, { solved: number; correct: number }>,
  });

  return {
    recommendedSubjects: subjectDistribution.map((s) => s.subject),
    dailyGoal: {
      totalQuestions: questionsPerDay,
      bySubject: subjectDistribution,
    },
    focusAreas: weakTopics.slice(0, 5),
    difficultyProgression: config.preferredDifficulty || zpd.optimalDifficulty,
    estimatedStudyTime: config.dailyStudyHours * 60,
  };
}

/**
 * Select next question based on adaptive algorithm
 */
export function selectNextQuestion(
  availableQuestions: Question[],
  userPerformance: UserPerformance,
  recentQuestionIds: string[],
  learningPath: LearningPath
): Question | null {
  if (availableQuestions.length === 0) return null;

  const zpd = calculateZPD(userPerformance);

  // Filter out recently seen questions
  let candidates = availableQuestions.filter(
    (q) => !recentQuestionIds.includes(q.id)
  );

  if (candidates.length === 0) {
    candidates = availableQuestions;
  }

  // Score each question
  const scoredQuestions = candidates.map((q) => {
    let score = 0;

    // Difficulty match (max 30 points)
    const diffDiff = Math.abs(q.difficulty - zpd.optimalDifficulty);
    score += 30 - diffDiff * 10;

    // Focus area match (max 40 points)
    const isFocusArea = learningPath.focusAreas.some(
      (f) => f.subject === q.subject && (f.topic === q.topic || f.topic === "전체")
    );
    if (isFocusArea) score += 40;

    // Subject priority (max 20 points)
    const subjectGoal = learningPath.dailyGoal.bySubject.find(
      (s) => s.subject === q.subject
    );
    if (subjectGoal) {
      score += subjectGoal.priority === "high" ? 20 : subjectGoal.priority === "medium" ? 10 : 5;
    }

    // Variety bonus (max 10 points)
    const recentSubjects = new Set(
      availableQuestions
        .filter((aq) => recentQuestionIds.includes(aq.id))
        .map((aq) => aq.subject)
    );
    if (!recentSubjects.has(q.subject)) {
      score += 10;
    }

    return { question: q, score };
  });

  // Sort by score and add some randomness
  scoredQuestions.sort((a, b) => b.score - a.score);

  // Pick from top 5 with weighted random selection
  const topCandidates = scoredQuestions.slice(0, Math.min(5, scoredQuestions.length));
  const totalScore = topCandidates.reduce((sum, c) => sum + c.score, 0);

  let random = Math.random() * totalScore;
  for (const candidate of topCandidates) {
    random -= candidate.score;
    if (random <= 0) {
      return candidate.question;
    }
  }

  return topCandidates[0]?.question || null;
}

/**
 * Calculate study efficiency score
 */
export function calculateEfficiency(
  totalSolved: number,
  correctCount: number,
  studyTimeMinutes: number
): {
  score: number;
  label: string;
  suggestions: string[];
} {
  const accuracy = correctCount / Math.max(1, totalSolved);
  const questionsPerHour = totalSolved / Math.max(0.1, studyTimeMinutes / 60);
  const correctPerHour = correctCount / Math.max(0.1, studyTimeMinutes / 60);

  // Efficiency = accuracy * speed (normalized)
  // Target: 80% accuracy, 30 questions/hour
  const targetAccuracy = 0.8;
  const targetSpeed = 30;

  const accuracyScore = Math.min(1, accuracy / targetAccuracy);
  const speedScore = Math.min(1, questionsPerHour / targetSpeed);

  const score = Math.round((accuracyScore * 0.6 + speedScore * 0.4) * 100);

  let label = "";
  const suggestions: string[] = [];

  if (score >= 90) {
    label = "최고 효율";
  } else if (score >= 75) {
    label = "좋은 효율";
  } else if (score >= 60) {
    label = "보통 효율";
    if (accuracy < 0.7) suggestions.push("정답률을 높이기 위해 개념을 복습하세요");
    if (questionsPerHour < 20) suggestions.push("문제 풀이 속도를 높여보세요");
  } else {
    label = "개선 필요";
    if (accuracy < 0.5) suggestions.push("기본 개념부터 다시 학습하세요");
    if (questionsPerHour < 15) suggestions.push("집중력을 높여 학습 속도를 개선하세요");
  }

  return { score, label, suggestions };
}
