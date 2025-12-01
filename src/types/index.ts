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
}

export const STREAK_REWARDS: Record<number, StreakReward> = {
  7: { coins: 100, badge: "일주일 연속" },
  14: { coins: 250, badge: "2주 연속" },
  30: { coins: 500, badge: "한달 연속", premiumDays: 3 },
  60: { coins: 1000, badge: "두달 연속", premiumDays: 7 },
  100: { coins: 2000, badge: "백일장", premiumDays: 14 },
  365: { coins: 10000, badge: "1년 개근", premiumDays: 30 },
};

export interface ExperienceGain {
  action: string;
  points: number;
}

export const EXPERIENCE_GAINS: ExperienceGain[] = [
  { action: "correct_answer", points: 10 },
  { action: "wrong_answer", points: 3 },
  { action: "daily_goal", points: 50 },
  { action: "mock_exam", points: 100 },
  { action: "lesson_complete", points: 30 },
  { action: "essay_submit", points: 50 },
  { action: "review_write", points: 20 },
];

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
