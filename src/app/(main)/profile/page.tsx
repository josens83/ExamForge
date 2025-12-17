"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Target,
  Award,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  TrendingUp,
  Edit,
  Settings,
  Crown,
  Zap,
  Star,
  Medal,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser = {
  id: "1",
  name: "김수험",
  email: "kim@example.com",
  phone: "010-1234-5678",
  image: null,
  targetExam: "9급 국가직 공무원",
  targetDate: new Date("2024-04-06"),
  targetScore: 85,
  membership: "premium",
  membershipExpiresAt: new Date("2024-12-31"),
  points: 12500,
  level: 15,
  experience: 7500,
  totalStudyDays: 127,
  currentStreak: 23,
  longestStreak: 45,
  createdAt: new Date("2023-06-15"),
};

// Mock stats
const mockStats = {
  totalQuestions: 4523,
  correctRate: 72,
  totalStudyTime: 15240, // minutes
  avgDailyStudy: 120, // minutes
  mockExamsTaken: 18,
  avgMockScore: 78,
  coursesEnrolled: 5,
  coursesCompleted: 3,
};

// Mock achievements
const mockAchievements = [
  {
    id: "1",
    name: "첫 걸음",
    description: "첫 문제를 풀었습니다",
    icon: "star",
    category: "quantity",
    unlockedAt: new Date("2023-06-15"),
    badgeColor: "bronze",
  },
  {
    id: "2",
    name: "꾸준함의 시작",
    description: "7일 연속 학습",
    icon: "flame",
    category: "streak",
    unlockedAt: new Date("2023-06-22"),
    badgeColor: "bronze",
  },
  {
    id: "3",
    name: "열정의 불꽃",
    description: "30일 연속 학습",
    icon: "flame",
    category: "streak",
    unlockedAt: new Date("2023-07-15"),
    badgeColor: "silver",
  },
  {
    id: "4",
    name: "문제 풀이왕",
    description: "1000문제 풀이 달성",
    icon: "book",
    category: "quantity",
    unlockedAt: new Date("2023-08-01"),
    badgeColor: "silver",
  },
  {
    id: "5",
    name: "정확도 마스터",
    description: "정답률 80% 달성",
    icon: "target",
    category: "accuracy",
    unlockedAt: new Date("2023-09-10"),
    badgeColor: "gold",
  },
  {
    id: "6",
    name: "모의고사 도전자",
    description: "10회 모의고사 응시",
    icon: "trophy",
    category: "quantity",
    unlockedAt: new Date("2023-10-05"),
    badgeColor: "silver",
  },
];

const lockedAchievements = [
  {
    id: "7",
    name: "전설의 시작",
    description: "100일 연속 학습",
    icon: "crown",
    category: "streak",
    badgeColor: "platinum",
    progress: 45,
  },
  {
    id: "8",
    name: "만점 달성",
    description: "모의고사 100점 달성",
    icon: "star",
    category: "special",
    badgeColor: "platinum",
    progress: 0,
  },
];

// Mock league data
const mockLeague = {
  name: "골드",
  tier: 3,
  icon: "crown",
  color: "text-yellow-500",
  weeklyXP: 2500,
  rank: 12,
  totalMembers: 50,
};

function getBadgeColorClass(color: string) {
  const colors: Record<string, string> = {
    bronze: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    silver: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    platinum: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return colors[color] || colors.bronze;
}

function getAchievementIcon(icon: string) {
  const icons: Record<string, React.ReactNode> = {
    star: <Star className="h-6 w-6" />,
    flame: <Flame className="h-6 w-6" />,
    book: <BookOpen className="h-6 w-6" />,
    target: <Target className="h-6 w-6" />,
    trophy: <Trophy className="h-6 w-6" />,
    crown: <Crown className="h-6 w-6" />,
    medal: <Medal className="h-6 w-6" />,
  };
  return icons[icon] || <Award className="h-6 w-6" />;
}

function formatStudyTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}일 ${hours % 24}시간`;
  }
  return `${hours}시간 ${minutes % 60}분`;
}

function getMembershipLabel(membership: string) {
  const labels: Record<string, { label: string; color: string }> = {
    free: { label: "무료", color: "bg-gray-500" },
    basic: { label: "베이직", color: "bg-blue-500" },
    premium: { label: "프리미엄", color: "bg-purple-500" },
    vip: { label: "VIP", color: "bg-yellow-500" },
  };
  return labels[membership] || labels.free;
}

export default function ProfilePage() {
  const user = mockUser;
  const stats = mockStats;
  const membership = getMembershipLabel(user.membership);

  const daysUntilExam = Math.ceil(
    (user.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const expForNextLevel = user.level * 1000;
  const expProgress = (user.experience / expForNextLevel) * 100;

  return (
    <div className="container py-8">
      {/* Profile header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-3xl">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            {/* User info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <Badge className={membership.color}>{membership.label}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {user.createdAt.toLocaleDateString()} 가입
                </div>
              </div>

              {/* Level & XP */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user.level}
                  </div>
                  <div>
                    <p className="text-sm font-medium">레벨 {user.level}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.experience.toLocaleString()} / {expForNextLevel.toLocaleString()} XP
                    </p>
                  </div>
                </div>
                <Progress value={expProgress} className="flex-1 max-w-xs h-2" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Link>
              </Button>
              <Button asChild>
                <Link href="/settings">
                  <Edit className="mr-2 h-4 w-4" />
                  프로필 수정
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalQuestions.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">풀이 문제</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.correctRate}%</p>
                    <p className="text-sm text-muted-foreground">정답률</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatStudyTime(stats.totalStudyTime)}</p>
                    <p className="text-sm text-muted-foreground">총 학습시간</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{user.currentStreak}일</p>
                    <p className="text-sm text-muted-foreground">연속 학습</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="achievements" className="space-y-6">
            <TabsList>
              <TabsTrigger value="achievements">업적</TabsTrigger>
              <TabsTrigger value="history">학습 기록</TabsTrigger>
              <TabsTrigger value="courses">수강 강의</TabsTrigger>
            </TabsList>

            {/* Achievements */}
            <TabsContent value="achievements" className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">획득한 업적 ({mockAchievements.length})</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {mockAchievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "h-12 w-12 rounded-full flex items-center justify-center",
                              getBadgeColorClass(achievement.badgeColor)
                            )}
                          >
                            {getAchievementIcon(achievement.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{achievement.name}</h4>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {achievement.unlockedAt.toLocaleDateString()} 달성
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">도전 중인 업적</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lockedAchievements.map((achievement) => (
                    <Card key={achievement.id} className="opacity-75">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "h-12 w-12 rounded-full flex items-center justify-center bg-muted text-muted-foreground"
                            )}
                          >
                            <Lock className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {achievement.description}
                            </p>
                            <div className="mt-2">
                              <Progress value={achievement.progress} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {achievement.progress}% 달성
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Learning history */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>최근 학습 기록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">행정법 문제 풀이</p>
                            <p className="text-sm text-muted-foreground">
                              25문제 풀이 | 정답률 76%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-500">+150 XP</p>
                          <p className="text-xs text-muted-foreground">{i}일 전</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enrolled courses */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>수강 중인 강의</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "행정법 기본이론", progress: 68, instructor: "김행정" },
                      { title: "헌법 핵심정리", progress: 100, instructor: "박헌법" },
                      { title: "국어 만점 전략", progress: 45, instructor: "이국어" },
                    ].map((course, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.instructor} 강사
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <Progress value={course.progress} className="h-2 flex-1" />
                            <span className="text-sm text-muted-foreground">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          이어듣기
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Target exam */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5" />
                목표 시험
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">{user.targetExam}</p>
                <p className="text-sm text-muted-foreground">
                  {user.targetDate.toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-3xl font-bold text-primary">D-{daysUntilExam}</p>
                <p className="text-sm text-muted-foreground">시험까지</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>목표 점수</span>
                  <span className="font-medium">{user.targetScore}점</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>예상 점수</span>
                  <span className="font-medium text-primary">{stats.avgMockScore}점</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* League */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                리그
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xl font-bold">{mockLeague.name} 리그</p>
                  <p className="text-sm text-muted-foreground">
                    주간 {mockLeague.rank}위 / {mockLeague.totalMembers}명
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>주간 XP</span>
                  <span className="font-medium">{mockLeague.weeklyXP.toLocaleString()} XP</span>
                </div>
                <Progress value={(mockLeague.rank / mockLeague.totalMembers) * 100} className="h-2" />
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/community/leaderboard">리더보드 보기</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Membership */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5" />
                멤버십
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={membership.color}>{membership.label}</Badge>
                <span className="text-sm text-muted-foreground">
                  {user.membershipExpiresAt?.toLocaleDateString()}까지
                </span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  모든 문제 풀이
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  AI 튜터 무제한
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  모의고사 무제한
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  프리미엄 강의 할인
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/pricing">멤버십 관리</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
