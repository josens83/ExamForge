"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  Target,
  BookOpen,
  ChevronRight,
  Shuffle,
  Play,
  Star,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const examTypes = [
  { value: "gosi_9", label: "9급 공무원" },
  { value: "gosi_7", label: "7급 공무원" },
  { value: "police", label: "경찰공무원" },
  { value: "fire", label: "소방공무원" },
  { value: "teacher", label: "교원임용" },
];

const subjects = [
  { value: "korean", label: "국어" },
  { value: "english", label: "영어" },
  { value: "history", label: "한국사" },
  { value: "admin_law", label: "행정법" },
  { value: "constitutional_law", label: "헌법" },
  { value: "economics", label: "경제학" },
  { value: "public_admin", label: "행정학" },
];

const difficulties = [
  { value: "1", label: "매우 쉬움" },
  { value: "2", label: "쉬움" },
  { value: "3", label: "보통" },
  { value: "4", label: "어려움" },
  { value: "5", label: "매우 어려움" },
];

// Mock questions data
const mockQuestions = [
  {
    id: "1",
    subject: "행정법",
    topic: "행정행위",
    content:
      "행정행위의 부관에 대한 설명으로 옳지 않은 것은? (다툼이 있는 경우 판례에 의함)",
    difficulty: 3,
    solveTime: 90,
    totalAttempts: 15420,
    correctRate: 67,
    year: 2023,
    source: "9급 국가직",
  },
  {
    id: "2",
    subject: "헌법",
    topic: "기본권",
    content: "헌법상 기본권의 주체에 관한 설명으로 옳은 것은?",
    difficulty: 4,
    solveTime: 120,
    totalAttempts: 12350,
    correctRate: 52,
    year: 2023,
    source: "7급 국가직",
  },
  {
    id: "3",
    subject: "국어",
    topic: "맞춤법",
    content: "밑줄 친 부분의 맞춤법이 옳은 것은?",
    difficulty: 2,
    solveTime: 60,
    totalAttempts: 18920,
    correctRate: 78,
    year: 2022,
    source: "9급 지방직",
  },
  {
    id: "4",
    subject: "영어",
    topic: "독해",
    content: "다음 글의 주제로 가장 적절한 것은?",
    difficulty: 3,
    solveTime: 150,
    totalAttempts: 10250,
    correctRate: 61,
    year: 2023,
    source: "9급 국가직",
  },
  {
    id: "5",
    subject: "한국사",
    topic: "조선시대",
    content: "조선 후기 사회 변화에 대한 설명으로 옳지 않은 것은?",
    difficulty: 3,
    solveTime: 90,
    totalAttempts: 14580,
    correctRate: 58,
    year: 2023,
    source: "9급 국가직",
  },
];

const studyModes = [
  {
    id: "practice",
    title: "연습 모드",
    description: "해설과 함께 천천히 학습",
    icon: BookOpen,
    color: "bg-blue-500",
  },
  {
    id: "exam",
    title: "실전 모드",
    description: "시간 제한과 함께 실전 연습",
    icon: Clock,
    color: "bg-orange-500",
  },
  {
    id: "random",
    title: "랜덤 모드",
    description: "AI 추천 문제로 학습",
    icon: Shuffle,
    color: "bg-purple-500",
  },
  {
    id: "weak",
    title: "취약점 집중",
    description: "약한 부분 집중 학습",
    icon: Target,
    color: "bg-red-500",
  },
];

function getDifficultyColor(difficulty: number) {
  const colors: Record<number, string> = {
    1: "bg-diff-1",
    2: "bg-diff-2",
    3: "bg-diff-3",
    4: "bg-diff-4",
    5: "bg-diff-5",
  };
  return colors[difficulty] || "bg-diff-3";
}

export default function QuestionsPage() {
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = mockQuestions.filter((q) => {
    if (selectedSubject && q.subject !== subjects.find(s => s.value === selectedSubject)?.label) return false;
    if (searchQuery && !q.content.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">문제은행</h1>
        <p className="text-muted-foreground mt-2">
          10만개 이상의 문제로 체계적인 학습을 시작하세요
        </p>
      </div>

      {/* Study modes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {studyModes.map((mode) => (
          <Link key={mode.id} href={`/questions/study?mode=${mode.id}`}>
            <Card className="h-full hover:border-primary transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-lg text-white mb-4",
                    mode.color
                  )}
                >
                  <mode.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{mode.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="문제 검색..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="시험 유형" />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((exam) => (
                  <SelectItem key={exam.value} value={exam.value}>
                    {exam.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="과목" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="난이도" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {diff.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">전체 문제</TabsTrigger>
          <TabsTrigger value="wrong">오답 노트</TabsTrigger>
          <TabsTrigger value="bookmarked">북마크</TabsTrigger>
          <TabsTrigger value="recent">최근 풀이</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              총 {filteredQuestions.length}문제
            </Badge>
            <Badge variant="outline" className="text-sm">
              오늘 풀이: 15문제
            </Badge>
          </div>

          {/* Question list */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="outline">{question.subject}</Badge>
                        <Badge variant="secondary">{question.topic}</Badge>
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full",
                              getDifficultyColor(question.difficulty)
                            )}
                          />
                          <span className="text-xs text-muted-foreground">
                            난이도 {question.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="font-medium line-clamp-2 mb-3">
                        {question.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {question.solveTime}초
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          정답률 {question.correctRate}%
                        </div>
                        <div>
                          {question.year} {question.source}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" asChild>
                        <Link href={`/questions/${question.id}`}>
                          풀기
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load more */}
          <div className="flex justify-center pt-4">
            <Button variant="outline">더 보기</Button>
          </div>
        </TabsContent>

        <TabsContent value="wrong">
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">오답 노트가 비어있습니다</h3>
              <p className="text-muted-foreground mb-4">
                문제를 풀고 틀린 문제를 여기서 복습하세요
              </p>
              <Button asChild>
                <Link href="/questions/study">문제 풀기 시작</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarked">
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">북마크한 문제가 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                중요한 문제를 북마크해서 나중에 복습하세요
              </p>
              <Button asChild>
                <Link href="/questions/study">문제 풀기 시작</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">최근 풀이 기록이 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                문제를 풀면 여기에 기록이 남습니다
              </p>
              <Button asChild>
                <Link href="/questions/study">문제 풀기 시작</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
