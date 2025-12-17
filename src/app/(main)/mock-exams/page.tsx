"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock data
const mockExams = [
  {
    id: "1",
    title: "2024년 9급 공무원 모의고사 1회",
    examType: "gosi_9",
    year: 2024,
    round: 1,
    totalQuestions: 100,
    totalTime: 100,
    type: "predicted",
    difficulty: "medium",
    isFree: true,
    participantCount: 3456,
    avgScore: 67.8,
    scheduledAt: null,
  },
  {
    id: "2",
    title: "2024년 9급 공무원 모의고사 2회",
    examType: "gosi_9",
    year: 2024,
    round: 2,
    totalQuestions: 100,
    totalTime: 100,
    type: "predicted",
    difficulty: "hard",
    isFree: false,
    price: 5000,
    participantCount: 2341,
    avgScore: 62.3,
    scheduledAt: new Date(Date.now() + 86400000 * 3),
  },
  {
    id: "3",
    title: "2023년 9급 국가직 기출문제",
    examType: "gosi_9",
    year: 2023,
    round: 1,
    totalQuestions: 100,
    totalTime: 100,
    type: "official",
    difficulty: "medium",
    isFree: true,
    participantCount: 15678,
    avgScore: 71.2,
    scheduledAt: null,
  },
  {
    id: "4",
    title: "행정법 집중 모의고사",
    examType: "gosi_9",
    year: 2024,
    totalQuestions: 40,
    totalTime: 40,
    type: "practice",
    difficulty: "easy",
    isFree: true,
    participantCount: 890,
    avgScore: 78.5,
    scheduledAt: null,
  },
];

const myAttempts = [
  {
    id: "attempt-1",
    mockExamId: "1",
    mockExamTitle: "2024년 9급 공무원 모의고사 1회",
    status: "graded",
    score: 72,
    rank: 456,
    percentile: 87,
    submittedAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: "attempt-2",
    mockExamId: "3",
    mockExamTitle: "2023년 9급 국가직 기출문제",
    status: "graded",
    score: 68,
    rank: 1234,
    percentile: 78,
    submittedAt: new Date(Date.now() - 86400000 * 7),
  },
];

const EXAM_TYPE_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "gosi_9", label: "9급 공무원" },
  { value: "gosi_7", label: "7급 공무원" },
  { value: "police", label: "경찰공무원" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "official", label: "기출문제" },
  { value: "predicted", label: "예상문제" },
  { value: "practice", label: "연습문제" },
];

const DIFFICULTY_BADGE: Record<string, { label: string; className: string }> = {
  easy: { label: "쉬움", className: "bg-green-500" },
  medium: { label: "보통", className: "bg-yellow-500" },
  hard: { label: "어려움", className: "bg-red-500" },
};

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  official: { label: "기출", className: "bg-blue-500" },
  predicted: { label: "예상", className: "bg-purple-500" },
  practice: { label: "연습", className: "bg-gray-500" },
};

export default function MockExamsPage() {
  const [activeTab, setActiveTab] = useState("available");
  const [examType, setExamType] = useState("all");
  const [type, setType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter exams
  const filteredExams = mockExams.filter((exam) => {
    if (examType !== "all" && exam.examType !== examType) return false;
    if (type !== "all" && exam.type !== type) return false;
    if (searchQuery && !exam.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">모의고사</h1>
        <p className="text-muted-foreground">
          실전처럼 연습하고 실력을 점검하세요
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{myAttempts.length}</div>
              <div className="text-sm text-muted-foreground">응시한 시험</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">
                {myAttempts.length > 0 ? Math.round(myAttempts.reduce((acc, a) => acc + a.score, 0) / myAttempts.length) : 0}점
              </div>
              <div className="text-sm text-muted-foreground">평균 점수</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {myAttempts.length > 0 ? Math.round(myAttempts.reduce((acc, a) => acc + a.percentile, 0) / myAttempts.length) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">평균 상위</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                {mockExams.filter((e) => e.scheduledAt && new Date(e.scheduledAt) > new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">예정된 시험</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="available">응시 가능</TabsTrigger>
          <TabsTrigger value="scheduled">예정된 시험</TabsTrigger>
          <TabsTrigger value="my-results">내 성적</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="모의고사 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="시험 유형" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="문제 유형" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Exam list */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={TYPE_BADGE[exam.type].className}>
                          {TYPE_BADGE[exam.type].label}
                        </Badge>
                        <Badge className={DIFFICULTY_BADGE[exam.difficulty].className}>
                          {DIFFICULTY_BADGE[exam.difficulty].label}
                        </Badge>
                        {exam.isFree && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            무료
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-semibold">{exam.totalQuestions}</div>
                      <div className="text-muted-foreground text-xs">문제</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-semibold">{exam.totalTime}분</div>
                      <div className="text-muted-foreground text-xs">시간</div>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-semibold">{exam.participantCount.toLocaleString()}</div>
                      <div className="text-muted-foreground text-xs">응시자</div>
                    </div>
                  </div>

                  {exam.avgScore && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">평균 점수</span>
                        <span className="font-medium">{exam.avgScore}점</span>
                      </div>
                      <Progress value={exam.avgScore} className="h-2" />
                    </div>
                  )}

                  <Button className="w-full">
                    {exam.isFree ? "시험 시작하기" : `${exam.price?.toLocaleString()}원 결제 후 응시`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            {mockExams
              .filter((exam) => exam.scheduledAt && new Date(exam.scheduledAt) > new Date())
              .map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={TYPE_BADGE[exam.type].className}>
                            {TYPE_BADGE[exam.type].label}
                          </Badge>
                          <Badge className={DIFFICULTY_BADGE[exam.difficulty].className}>
                            {DIFFICULTY_BADGE[exam.difficulty].label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{exam.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exam.scheduledAt && formatDate(new Date(exam.scheduledAt))} 시작
                        </p>
                      </div>
                      <Button variant="outline">알림 설정</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {mockExams.filter((exam) => exam.scheduledAt && new Date(exam.scheduledAt) > new Date()).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                예정된 시험이 없습니다.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-results">
          <div className="space-y-4">
            {myAttempts.map((attempt) => (
              <Card key={attempt.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{attempt.mockExamTitle}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(attempt.submittedAt)} 응시
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{attempt.score}점</div>
                        <div className="text-xs text-muted-foreground">점수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">상위 {100 - attempt.percentile}%</div>
                        <div className="text-xs text-muted-foreground">{attempt.rank}등</div>
                      </div>
                      <Button variant="outline">결과 보기</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {myAttempts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                아직 응시한 시험이 없습니다.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
