"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Flame,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
  GraduationCap,
  AlertTriangle,
  ChevronRight,
  Calendar,
  BarChart3,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  // Mock data for demonstration
  const stats = {
    predictedScore: 78.5,
    accuracy: 72.3,
    studyTime: "2시간 30분",
    todayStudy: "45분",
    streak: 15,
    dailyGoal: 30,
    todaySolved: 20,
  };

  const weakTopics = [
    { subject: "행정법", topic: "행정행위", accuracy: 45 },
    { subject: "헌법", topic: "기본권", accuracy: 52 },
  ];

  const recentCourses = [
    { id: "1", title: "2024 행정법 기본이론", progress: 65, instructor: "김행정" },
    { id: "2", title: "헌법 핵심정리", progress: 40, instructor: "박헌법" },
  ];

  const upcomingMockExams = [
    { id: "1", title: "9급 공무원 모의고사 3회", date: "2024-03-15", participants: 1234 },
    { id: "2", title: "행정법 단원별 모의고사", date: "2024-03-18", participants: 567 },
  ];

  return (
    <div className="container py-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            좋은 아침이에요, {session.user?.name || "학습자"}님!
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Flame className="h-4 w-4 text-orange-500 streak-fire" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {stats.streak}일 연속 학습 중
              </span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href="/questions">
            <Play className="mr-2 h-4 w-4" />
            학습 시작
          </Link>
        </Button>
      </div>

      {/* Daily goal */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">오늘의 목표</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">수정</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress
              value={(stats.todaySolved / stats.dailyGoal) * 100}
              className="h-3"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {stats.todaySolved}/{stats.dailyGoal} 문제 완료
              </span>
              <span className="font-medium">
                {Math.round((stats.todaySolved / stats.dailyGoal) * 100)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">국어 10문제</Badge>
              <Badge variant="outline">영어 5문제</Badge>
              <Badge variant="outline">한국사 5문제</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">예상 점수</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.predictedScore}점</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+2.3</span> 지난 주 대비
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">정답률</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+1.8%</span> 지난 주 대비
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 학습 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyTime}</div>
            <p className="text-xs text-muted-foreground">오늘 {stats.todayStudy}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">연속 학습</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streak}일</div>
            <p className="text-xs text-muted-foreground">최고 기록: 30일</p>
          </CardContent>
        </Card>
      </div>

      {/* Weak topics alert */}
      {weakTopics.length > 0 && (
        <Card className="mb-8 border-warning">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle className="text-lg">취약 영역 알림</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weakTopics.map((topic, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">
                      {topic.subject} &gt; {topic.topic}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      정답률 {topic.accuracy}%
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/questions?subject=${topic.subject}&topic=${topic.topic}`}>
                      집중 학습하기
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                수강 중인 강의
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/courses">
                  전체 보기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{course.title}</h4>
                    <span className="text-sm text-muted-foreground">
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {course.instructor} 강사
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming mock exams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                예정된 모의고사
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mock-exams">
                  전체 보기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMockExams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/mock-exams/${exam.id}`}
                  className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <h4 className="font-medium">{exam.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {exam.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {exam.participants.toLocaleString()}명 참여
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">빠른 시작</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/questions">
                <FileText className="h-6 w-6" />
                <span>문제 풀기</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/questions?type=wrong">
                <Target className="h-6 w-6" />
                <span>오답 복습</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/mock-exams">
                <GraduationCap className="h-6 w-6" />
                <span>모의고사</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/analytics">
                <BarChart3 className="h-6 w-6" />
                <span>학습 분석</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
