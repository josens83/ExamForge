import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

export function formatCurrency(amount: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}시간`;
  }
  return `${hours}시간 ${mins}분`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  }
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}분 전`;
  }
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  }
  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  }
  return formatDate(d);
}

export function getDifficultyLabel(difficulty: number): string {
  const labels: Record<number, string> = {
    1: "매우 쉬움",
    2: "쉬움",
    3: "보통",
    4: "어려움",
    5: "매우 어려움",
  };
  return labels[difficulty] || "보통";
}

export function getDifficultyColor(difficulty: number): string {
  const colors: Record<number, string> = {
    1: "text-diff-1",
    2: "text-diff-2",
    3: "text-diff-3",
    4: "text-diff-4",
    5: "text-diff-5",
  };
  return colors[difficulty] || "text-diff-3";
}

export function getExamTypeLabel(examType: string): string {
  const labels: Record<string, string> = {
    gosi_9: "9급 공무원",
    gosi_7: "7급 공무원",
    gosi_5: "5급 공무원",
    police: "경찰공무원",
    fire: "소방공무원",
    teacher: "교원임용",
    cpa: "공인회계사",
    lawyer: "변호사",
    patent: "변리사",
    toeic: "TOEIC",
    toefl: "TOEFL",
    ielts: "IELTS",
    sqld: "SQLD",
    aip: "정보처리기사",
    engineer: "기술사",
  };
  return labels[examType] || examType;
}

export function getSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    korean: "국어",
    english: "영어",
    history: "한국사",
    admin_law: "행정법",
    constitutional_law: "헌법",
    civil_law: "민법",
    economics: "경제학",
    public_admin: "행정학",
    social: "사회",
    math: "수학",
    science: "과학",
    computer: "컴퓨터일반",
  };
  return labels[subject] || subject;
}

export function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    multiple_choice: "객관식",
    multiple_select: "다중선택",
    true_false: "OX",
    fill_blank: "빈칸채우기",
    essay: "논술형",
    case_study: "사례분석",
  };
  return labels[type] || type;
}

export function getMembershipLabel(membership: string): string {
  const labels: Record<string, string> = {
    free: "무료",
    basic: "베이직",
    premium: "프리미엄",
    vip: "VIP",
  };
  return labels[membership] || membership;
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return (correct / total) * 100;
}

export function calculateExperience(
  level: number,
): { current: number; required: number } {
  // Experience thresholds per level
  const thresholds = [
    0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800,
    9100, 10500, 12000, 13600, 15300, 17100, 19000, 21000, 23100, 25300, 27600,
    30000, 32500, 35100, 37800, 40600, 43500, 46500, 49600, 52800, 56100, 59500,
    63000, 66600, 70300, 74100, 78000, 82000, 86100, 90300, 94600, 99000,
    103500, 108100, 112800, 117600, 122500,
  ];

  const currentThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || currentThreshold + 5000;

  return {
    current: currentThreshold,
    required: nextThreshold - currentThreshold,
  };
}

export function getLevelTitle(level: number): string {
  if (level <= 10) return "수험생";
  if (level <= 20) return "공시생";
  if (level <= 30) return "열공러";
  if (level <= 40) return "스터디왕";
  if (level <= 50) return "합격예감";
  return "합격신화";
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `EF${timestamp}${random}`.toUpperCase();
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
