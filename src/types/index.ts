// ==================== Exam Types ====================
export type ExamType =
  | "gosi_9"
  | "gosi_7"
  | "gosi_5"
  | "police"
  | "fire"
  | "teacher"
  | "cpa"
  | "lawyer"
  | "patent"
  | "toeic"
  | "toefl"
  | "ielts"
  | "sqld"
  | "aip"
  | "engineer";

export type Subject =
  | "korean"
  | "english"
  | "history"
  | "admin_law"
  | "constitutional_law"
  | "civil_law"
  | "economics"
  | "public_admin"
  | "social"
  | "math"
  | "science"
  | "computer";

export type QuestionType =
  | "multiple_choice"
  | "multiple_select"
  | "true_false"
  | "fill_blank"
  | "essay"
  | "case_study";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type MembershipTier = "free" | "basic" | "premium" | "vip";

// ==================== Question Types ====================
export interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
  selectRate?: number;
}

export interface Question {
  id: string;
  examType: ExamType;
  subject: Subject;
  chapter?: string;
  topic?: string;
  tags: string[];
  type: QuestionType;
  content: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: Difficulty;
  solveTime: number;
  totalAttempts: number;
  correctCount: number;
  source?: string;
  year?: number;
  aiHints: string[];
  relatedQuestions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAnswer {
  id: string;
  userId: string;
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  timeSpent?: number;
  essayContent?: string;
  aiScore?: number;
  aiFeedback?: string;
  attemptNumber: number;
  createdAt: Date;
}

// ==================== Analytics Types ====================
export interface SubjectStat {
  subject: Subject;
  totalSolved: number;
  accuracy: number;
  avgTimePerQuestion: number;
  trend: "improving" | "stable" | "declining";
  recentAccuracy: number;
}

export interface WeakTopic {
  subject: Subject;
  topic: string;
  accuracy: number;
  totalAttempts: number;
  recommendedQuestions: string[];
  priority: "high" | "medium" | "low";
}

export interface UserAnalytics {
  userId: string;
  examType: ExamType;
  totalSolved: number;
  totalCorrect: number;
  totalStudyTime: number;
  subjectStats: SubjectStat[];
  weakTopics: WeakTopic[];
  predictedScore?: number;
  percentile?: number;
  targetScore?: number;
  targetDate?: Date;
}

export interface StudyRecommendation {
  userId: string;
  date: Date;
  dailyGoal: {
    totalQuestions: number;
    bySubject: { subject: Subject; count: number }[];
    estimatedTime: number;
  };
  reviewNeeded: {
    questionIds: string[];
    reason: "wrong_twice" | "forgot" | "important";
  };
  weaknessTraining: {
    topic: string;
    questionIds: string[];
    targetAccuracy: number;
  };
}

// ==================== Course Types ====================
export interface Instructor {
  id: string;
  userId?: string;
  name: string;
  title?: string;
  bio?: string;
  avatar?: string;
  specialties: string[];
  totalStudents: number;
  totalCourses: number;
  avgRating: number;
}

export interface Material {
  id: string;
  title: string;
  type: "pdf" | "doc" | "ppt" | "link";
  url: string;
  downloadable: boolean;
}

export interface Lesson {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  type: "video" | "live" | "quiz" | "assignment";
  videoUrl?: string;
  duration?: number;
  scheduledAt?: Date;
  liveRoomId?: string;
  questionIds: string[];
  materials: Material[];
  isFree: boolean;
}

export interface Chapter {
  id: string;
  courseId: string;
  number: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  previewVideoUrl?: string;
  examType: ExamType;
  subject?: Subject;
  level: "beginner" | "intermediate" | "advanced";
  instructorId: string;
  instructor?: Instructor;
  totalLessons: number;
  totalDuration: number;
  chapters?: Chapter[];
  originalPrice: number;
  salePrice?: number;
  saleEndsAt?: Date;
  courseType: "recorded" | "live" | "omo";
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  completionRate: number;
  includes: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course?: Course;
  status: "active" | "completed" | "expired" | "refunded";
  progress: number;
  currentLessonId?: string;
  lastAccessedAt?: Date;
  paidAmount: number;
  paymentMethod?: string;
  orderId?: string;
  startsAt: Date;
  expiresAt?: Date;
  isGuaranteed: boolean;
  guaranteeConditions?: GuaranteeCondition[];
  createdAt: Date;
}

export interface GuaranteeCondition {
  type: "attendance" | "assignment" | "mock_exam";
  required: number;
  completed: number;
  isMet: boolean;
}

export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  content?: string;
  isVerified: boolean;
  createdAt: Date;
}

// ==================== Mock Exam Types ====================
export interface MockExamSection {
  id: string;
  subject: Subject;
  questionIds: string[];
  timeLimit?: number;
  score: number;
}

export interface MockExam {
  id: string;
  title: string;
  examType: ExamType;
  year?: number;
  round?: number;
  sections: MockExamSection[];
  totalQuestions: number;
  totalTime: number;
  totalScore: number;
  passingScore?: number;
  type: "official" | "predicted" | "practice";
  difficulty: "easy" | "medium" | "hard";
  isFree: boolean;
  price?: number;
  scheduledAt?: Date;
  resultsReleasedAt?: Date;
  participantCount: number;
  avgScore?: number;
  createdAt: Date;
}

export interface MockExamAttemptAnswer {
  questionId: string;
  answer: string | string[];
  timeSpent: number;
  flagged: boolean;
}

export interface MockExamResult {
  totalScore: number;
  percentage: number;
  rank: number;
  percentile: number;
  sectionScores: {
    subject: Subject;
    score: number;
    maxScore: number;
    accuracy: number;
  }[];
  wrongQuestions: string[];
  partialQuestions: string[];
}

export interface MockExamAttempt {
  id: string;
  userId: string;
  mockExamId: string;
  mockExam?: MockExam;
  status: "in_progress" | "submitted" | "graded";
  startedAt: Date;
  submittedAt?: Date;
  timeSpent?: number;
  answers: MockExamAttemptAnswer[];
  result?: MockExamResult;
  createdAt: Date;
}

// ==================== Essay Grading Types ====================
export interface RubricItem {
  criterion: string;
  description: string;
  maxPoints: number;
  keywords?: string[];
}

export interface EssayQuestion {
  id: string;
  questionId: string;
  prompt: string;
  rubric: RubricItem[];
  maxScore: number;
  wordLimit?: { min: number; max: number };
  sampleAnswer?: string;
}

export interface AIGradingResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  rubricScores: {
    criterion: string;
    score: number;
    maxScore: number;
    feedback: string;
  }[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  plagiarismScore: number;
  similarSources?: string[];
  gradedAt: Date;
  gradingTime: number;
}

export interface EssaySubmission {
  id: string;
  userId: string;
  questionId: string;
  content: string;
  wordCount?: number;
  submittedAt: Date;
  aiGrading?: AIGradingResult;
  reGradeRequested: boolean;
  humanGrading?: {
    graderId: string;
    score: number;
    feedback: string;
    gradedAt: Date;
  };
}

// ==================== Payment Types ====================
export interface Payment {
  id: string;
  userId: string;
  type: "membership" | "course" | "mock_exam";
  itemId?: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  provider: "toss" | "stripe";
  paymentKey?: string;
  orderId: string;
  metadata?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
}

// ==================== Membership Benefits ====================
export interface MembershipBenefits {
  dailyQuestions: number;
  mockExamsPerMonth: number;
  aiEssayGrading: number;
  courseDiscount: number;
  offlineSupport: boolean;
  prioritySupport: boolean;
  mentoringMinutes?: number;
  price?: number;
}

export const MEMBERSHIP_BENEFITS: Record<MembershipTier, MembershipBenefits> = {
  free: {
    dailyQuestions: 30,
    mockExamsPerMonth: 1,
    aiEssayGrading: 0,
    courseDiscount: 0,
    offlineSupport: false,
    prioritySupport: false,
  },
  basic: {
    dailyQuestions: 100,
    mockExamsPerMonth: 5,
    aiEssayGrading: 10,
    courseDiscount: 0.1,
    offlineSupport: false,
    prioritySupport: false,
    price: 9900,
  },
  premium: {
    dailyQuestions: Infinity,
    mockExamsPerMonth: Infinity,
    aiEssayGrading: 50,
    courseDiscount: 0.15,
    offlineSupport: true,
    prioritySupport: false,
    price: 29900,
  },
  vip: {
    dailyQuestions: Infinity,
    mockExamsPerMonth: Infinity,
    aiEssayGrading: Infinity,
    courseDiscount: 0.2,
    offlineSupport: true,
    prioritySupport: true,
    mentoringMinutes: 60,
    price: 99900,
  },
};

// ==================== Gamification Types ====================
export interface StreakReward {
  coins: number;
  badge: string;
  premiumDays?: number;
  streakFreeze?: number;
}

export const STREAK_REWARDS: Record<number, StreakReward> = {
  3: { coins: 30, badge: "3일 연속" },
  7: { coins: 100, badge: "일주일 연속", streakFreeze: 1 },
  14: { coins: 250, badge: "2주 연속", streakFreeze: 1 },
  30: { coins: 500, badge: "한달 연속", premiumDays: 3, streakFreeze: 2 },
  60: { coins: 1000, badge: "두달 연속", premiumDays: 7, streakFreeze: 2 },
  100: { coins: 2000, badge: "백일장", premiumDays: 14, streakFreeze: 3 },
  365: { coins: 10000, badge: "1년 개근", premiumDays: 30, streakFreeze: 5 },
};

export interface ExperienceGain {
  action: string;
  points: number;
  description: string;
}

export const EXPERIENCE_GAINS: ExperienceGain[] = [
  { action: "correct_answer", points: 10, description: "정답 맞추기" },
  { action: "wrong_answer", points: 3, description: "오답 (참여 보상)" },
  { action: "daily_goal", points: 50, description: "일일 목표 달성" },
  { action: "mock_exam", points: 100, description: "모의고사 완료" },
  { action: "lesson_complete", points: 30, description: "강의 완료" },
  { action: "essay_submit", points: 50, description: "논술 제출" },
  { action: "review_write", points: 20, description: "리뷰 작성" },
  { action: "streak_bonus", points: 5, description: "연속 학습 보너스 (일당)" },
  { action: "perfect_session", points: 100, description: "세션 전문제 정답" },
  { action: "speed_bonus", points: 15, description: "빠른 정답 보너스" },
  { action: "challenge_complete", points: 200, description: "일일 챌린지 완료" },
];

// ==================== League System ====================
export type LeagueTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "master" | "champion";

export interface League {
  id: string;
  name: string;
  tier: number;
  minXP: number;
  icon: string;
  color: string;
  weeklyReset: boolean;
}

export const LEAGUES: Record<LeagueTier, Omit<League, "id">> = {
  bronze: { name: "브론즈", tier: 1, minXP: 0, icon: "🥉", color: "#CD7F32", weeklyReset: true },
  silver: { name: "실버", tier: 2, minXP: 500, icon: "🥈", color: "#C0C0C0", weeklyReset: true },
  gold: { name: "골드", tier: 3, minXP: 1500, icon: "🥇", color: "#FFD700", weeklyReset: true },
  platinum: { name: "플래티넘", tier: 4, minXP: 3000, icon: "💎", color: "#E5E4E2", weeklyReset: true },
  diamond: { name: "다이아몬드", tier: 5, minXP: 5000, icon: "💠", color: "#B9F2FF", weeklyReset: true },
  master: { name: "마스터", tier: 6, minXP: 8000, icon: "🏆", color: "#9400D3", weeklyReset: true },
  champion: { name: "챔피언", tier: 7, minXP: 12000, icon: "👑", color: "#FF4500", weeklyReset: true },
};

export interface LeagueMember {
  id: string;
  leagueId: string;
  userId: string;
  userName: string;
  userImage?: string;
  weeklyXP: number;
  rank: number;
  isCurrentUser?: boolean;
}

// ==================== Achievement System ====================
export type AchievementCategory = "streak" | "accuracy" | "quantity" | "speed" | "special";
export type BadgeColor = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: {
    type: string;
    value: number;
    subject?: Subject;
  };
  xpReward: number;
  badgeColor: BadgeColor;
  isSecret: boolean;
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
  progress: number;
}

export const ACHIEVEMENTS: Omit<Achievement, "id">[] = [
  // Streak achievements
  { code: "streak_7", name: "일주일 전사", description: "7일 연속 학습", icon: "🔥", category: "streak", requirement: { type: "streak", value: 7 }, xpReward: 100, badgeColor: "bronze", isSecret: false },
  { code: "streak_30", name: "한달 마스터", description: "30일 연속 학습", icon: "⚡", category: "streak", requirement: { type: "streak", value: 30 }, xpReward: 500, badgeColor: "silver", isSecret: false },
  { code: "streak_100", name: "백일장", description: "100일 연속 학습", icon: "💫", category: "streak", requirement: { type: "streak", value: 100 }, xpReward: 2000, badgeColor: "gold", isSecret: false },
  { code: "streak_365", name: "1년 개근왕", description: "365일 연속 학습", icon: "👑", category: "streak", requirement: { type: "streak", value: 365 }, xpReward: 10000, badgeColor: "platinum", isSecret: false },

  // Quantity achievements
  { code: "solve_100", name: "백문백답", description: "100문제 풀기", icon: "📝", category: "quantity", requirement: { type: "total_solved", value: 100 }, xpReward: 100, badgeColor: "bronze", isSecret: false },
  { code: "solve_1000", name: "천문일답", description: "1,000문제 풀기", icon: "📚", category: "quantity", requirement: { type: "total_solved", value: 1000 }, xpReward: 500, badgeColor: "silver", isSecret: false },
  { code: "solve_10000", name: "만문일답", description: "10,000문제 풀기", icon: "🎓", category: "quantity", requirement: { type: "total_solved", value: 10000 }, xpReward: 2000, badgeColor: "gold", isSecret: false },

  // Accuracy achievements
  { code: "accuracy_80", name: "정확 사수", description: "정답률 80% 달성", icon: "🎯", category: "accuracy", requirement: { type: "accuracy", value: 80 }, xpReward: 200, badgeColor: "bronze", isSecret: false },
  { code: "accuracy_90", name: "정밀 타격", description: "정답률 90% 달성", icon: "💎", category: "accuracy", requirement: { type: "accuracy", value: 90 }, xpReward: 500, badgeColor: "silver", isSecret: false },
  { code: "perfect_session", name: "완벽한 세션", description: "세션 전체 정답 (10문제 이상)", icon: "✨", category: "accuracy", requirement: { type: "perfect_session", value: 10 }, xpReward: 100, badgeColor: "gold", isSecret: false },

  // Speed achievements
  { code: "speed_demon", name: "스피드 데몬", description: "평균 풀이시간 30초 미만", icon: "⚡", category: "speed", requirement: { type: "avg_time", value: 30 }, xpReward: 300, badgeColor: "silver", isSecret: false },
  { code: "quick_learner", name: "빠른 학습자", description: "1시간에 100문제 풀기", icon: "🚀", category: "speed", requirement: { type: "hourly_solve", value: 100 }, xpReward: 500, badgeColor: "gold", isSecret: false },

  // Special achievements
  { code: "early_bird", name: "얼리버드", description: "오전 6시 이전 학습", icon: "🌅", category: "special", requirement: { type: "early_study", value: 6 }, xpReward: 50, badgeColor: "bronze", isSecret: false },
  { code: "night_owl", name: "올빼미", description: "자정 이후 학습", icon: "🦉", category: "special", requirement: { type: "late_study", value: 0 }, xpReward: 50, badgeColor: "bronze", isSecret: false },
  { code: "weekend_warrior", name: "주말 전사", description: "주말 연속 학습 완료", icon: "⚔️", category: "special", requirement: { type: "weekend_streak", value: 2 }, xpReward: 100, badgeColor: "silver", isSecret: false },
  { code: "first_exam", name: "첫 도전", description: "첫 모의고사 응시", icon: "🎪", category: "special", requirement: { type: "mock_exam", value: 1 }, xpReward: 100, badgeColor: "bronze", isSecret: false },
  { code: "comeback_king", name: "컴백킹", description: "틀린 문제 재도전 후 정답", icon: "💪", category: "special", requirement: { type: "retry_correct", value: 1 }, xpReward: 50, badgeColor: "bronze", isSecret: true },
];

// ==================== Daily Challenge ====================
export interface DailyChallenge {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: "questions" | "time" | "streak" | "accuracy";
  requirement: {
    count: number;
    subject?: Subject | "all";
    minAccuracy?: number;
  };
  xpReward: number;
  bonusReward?: {
    type: "streak_freeze" | "double_xp" | "premium_day";
    count: number;
  };
  progress?: number;
  completed?: boolean;
}

// ==================== Study Session ====================
export interface StudySession {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  questionsCompleted: number;
  correctAnswers: number;
  xpEarned: number;
  subject?: Subject;
  sessionType: "practice" | "mock_exam" | "review";
}

// ==================== User Inventory ====================
export interface UserInventory {
  streakFreezes: number;
  doubleXPHours: number;
  premiumDays: number;
}

// ==================== Spaced Repetition ====================
export interface SpacedRepetitionCard {
  id: string;
  userId: string;
  questionId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
  lastReviewAt?: Date;
}

export type SpacedRepetitionQuality = 0 | 1 | 2 | 3 | 4 | 5; // 0=complete blackout, 5=perfect response

// ==================== Social Learning ====================
export interface StudyGroup {
  id: string;
  name: string;
  description?: string;
  examType: ExamType;
  isPublic: boolean;
  maxMembers: number;
  memberCount: number;
  creatorId: string;
  createdAt: Date;
}

export interface Discussion {
  id: string;
  studyGroupId?: string;
  questionId?: string;
  userId: string;
  userName: string;
  userImage?: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  isResolved: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  discussionId: string;
  userId: string;
  userName: string;
  userImage?: string;
  parentId?: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  createdAt: Date;
  replies?: Comment[];
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
