"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data
const overviewStats = {
  totalSolved: 1234,
  totalCorrect: 987,
  totalStudyTime: 4567, // minutes
  currentStreak: 7,
  predictedScore: 78,
  targetScore: 85,
  daysUntilExam: 45,
};

const subjectStats = [
  { subject: "행정법", totalSolved: 320, accuracy: 82, avgTime: 45, trend: "improving" },
  { subject: "헌법", totalSolved: 280, accuracy: 78, avgTime: 52, trend: "stable" },
  { subject: "국어", totalSolved: 250, accuracy: 85, avgTime: 38, trend: "improving" },
  { subject: "영어", totalSolved: 220, accuracy: 72, avgTime: 65, trend: "declining" },
  { subject: "한국사", totalSolved: 164, accuracy: 88, avgTime: 42, trend: "improving" },
];

const weakTopics = [
  { subject: "영어", topic: "독해 - 빈칸 추론", accuracy: 58, attempts: 45, priority: "high" },
  { subject: "행정법", topic: "행정소송", accuracy: 65, attempts: 38, priority: "high" },
  { subject: "헌법", topic: "기본권 제한", accuracy: 68, attempts: 32, priority: "medium" },
  { subject: "영어", topic: "문법 - 시제", accuracy: 70, attempts: 28, priority: "medium" },
];

const weeklyProgress = [
  { day: "월", solved: 45, correct: 38 },
  { day: "화", solved: 52, correct: 44 },
  { day: "수", solved: 38, correct: 31 },
  { day: "목", solved: 61, correct: 55 },
  { day: "금", solved: 48, correct: 42 },
  { day: "토", solved: 72, correct: 63 },
  { day: "일", solved: 35, correct: 30 },
];

const TREND_COLORS = {
  improving: "text-green-500",
  stable: "text-yellow-500",
  declining: "text-red-500",
};

const TREND_LABELS = {
  improving: "상승",
  stable: "유지",
  declining: "하락",
};

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("week");

  const accuracy = Math.round((overviewStats.totalCorrect / overviewStats.totalSolved) * 100);
  const studyHours = Math.floor(overviewStats.totalStudyTime / 60);
  const progressToTarget = (overviewStats.predictedScore / overviewStats.targetScore) * 100;

  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">학습 분석</h1>
          <p className="text-muted-foreground">
            나의 학습 현황을 분석하고 효율적으로 공부하세요
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">최근 1주</SelectItem>
            <SelectItem value="month">최근 1달</SelectItem>
            <SelectItem value="3month">최근 3달</SelectItem>
            <SelectItem value="all">전체</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {overviewStats.totalSolved.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">푼 문제</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">정답률</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{studyHours}시간</div>
              <div className="text-sm text-muted-foreground">총 학습 시간</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {overviewStats.currentStreak}일
              </div>
              <div className="text-sm text-muted-foreground">연속 학습</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="subjects">과목별 분석</TabsTrigger>
          <TabsTrigger value="weakness">취약점 분석</TabsTrigger>
          <TabsTrigger value="prediction">점수 예측</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Weekly progress chart placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">주간 학습 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyProgress.map((day) => (
                    <div key={day.day} className="flex items-center gap-3">
                      <span className="w-8 text-sm text-muted-foreground">{day.day}</span>
                      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${(day.correct / 80) * 100}%` }}
                        />
                        <div
                          className="h-full bg-red-300"
                          style={{ width: `${((day.solved - day.correct) / 80) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm text-right">
                        {day.correct}/{day.solved}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span>정답</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-300" />
                    <span>오답</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study time distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">학습 시간 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectStats.slice(0, 5).map((subject) => {
                    const percentage = (subject.totalSolved / overviewStats.totalSolved) * 100;
                    return (
                      <div key={subject.subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject.subject}</span>
                          <span className="text-muted-foreground">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent activity */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">최근 학습 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const intensity = Math.random();
                    return (
                      <div
                        key={i}
                        className={cn(
                          "aspect-square rounded-sm",
                          intensity > 0.7
                            ? "bg-green-500"
                            : intensity > 0.4
                            ? "bg-green-300"
                            : intensity > 0.1
                            ? "bg-green-100"
                            : "bg-muted"
                        )}
                        title={`${Math.floor(intensity * 50)}문제`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  최근 4주간 학습 기록
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="space-y-4">
            {subjectStats.map((subject) => (
              <Card key={subject.subject}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{subject.subject}</h3>
                        <Badge
                          variant="outline"
                          className={TREND_COLORS[subject.trend as keyof typeof TREND_COLORS]}
                        >
                          {TREND_LABELS[subject.trend as keyof typeof TREND_LABELS]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={subject.accuracy} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-12">{subject.accuracy}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-xl font-bold">{subject.totalSolved}</div>
                        <div className="text-xs text-muted-foreground">푼 문제</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{subject.accuracy}%</div>
                        <div className="text-xs text-muted-foreground">정답률</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{subject.avgTime}초</div>
                        <div className="text-xs text-muted-foreground">평균 시간</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      상세 분석
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weakness">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">취약 토픽 TOP 5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weakTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Badge className={PRIORITY_COLORS[topic.priority as keyof typeof PRIORITY_COLORS]}>
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{topic.topic}</span>
                          <Badge variant="outline" className="text-xs">
                            {topic.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={topic.accuracy} className="flex-1 h-1.5" />
                          <span className="text-xs text-muted-foreground">
                            {topic.accuracy}%
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        집중 학습
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">추천 학습 계획</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                      우선 학습 필요
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      영어 독해 - 빈칸 추론 파트의 정답률이 낮습니다.
                    </p>
                    <Button size="sm" variant="outline">
                      관련 문제 풀기
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                      복습 권장
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      행정소송 관련 개념을 복습하면 좋겠습니다.
                    </p>
                    <Button size="sm" variant="outline">
                      복습하기
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">
                      잘하고 있어요!
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      한국사 정답률이 꾸준히 상승하고 있습니다. 이 페이스를 유지하세요!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prediction">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">예상 점수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {overviewStats.predictedScore}
                  </div>
                  <div className="text-muted-foreground">
                    예상 점수 (목표: {overviewStats.targetScore}점)
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>목표 달성률</span>
                    <span>{Math.round(progressToTarget)}%</span>
                  </div>
                  <Progress value={progressToTarget} className="h-3" />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-center">
                    현재 추세를 유지하면{" "}
                    <span className="font-semibold text-primary">
                      약 {Math.ceil((overviewStats.targetScore - overviewStats.predictedScore) / 0.5)}일
                    </span>{" "}
                    후 목표 달성 예상
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">과목별 예상 점수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjectStats.map((subject) => {
                    const predictedScore = Math.round(subject.accuracy * 0.9 + Math.random() * 10);
                    return (
                      <div key={subject.subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{subject.subject}</span>
                          <span className="font-medium">{predictedScore}점</span>
                        </div>
                        <Progress value={predictedScore} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">총점 예상</span>
                    <span className="text-xl font-bold text-primary">
                      {overviewStats.predictedScore}점
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">D-{overviewStats.daysUntilExam} 학습 가이드</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">일일 목표</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- 문제 풀이: 50문제</li>
                      <li>- 오답 복습: 20문제</li>
                      <li>- 취약 토픽: 30분</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">집중 과목</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>1. 영어 (정답률 향상 필요)</li>
                      <li>2. 행정법 (실전 적용력)</li>
                      <li>3. 헌법 (판례 암기)</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">권장 스케줄</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>- 평일: 3시간</li>
                      <li>- 주말: 5시간</li>
                      <li>- 모의고사: 주 1회</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
