"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpacedRepetitionReview } from "@/components/review";
import { getReviewRecommendation, formatInterval, calculateRetention } from "@/lib/spaced-repetition";
import { Question, SpacedRepetitionCard } from "@/types";

// Mock data
const mockDueCards: (SpacedRepetitionCard & { question: Question })[] = [
  {
    id: "card-1",
    userId: "user-1",
    questionId: "q-1",
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewAt: new Date(),
    question: {
      id: "q-1",
      examType: "gosi_9",
      subject: "admin_law",
      chapter: "행정행위",
      topic: "행정행위의 부관",
      type: "multiple_choice",
      content: "행정행위의 부관에 대한 설명으로 옳지 않은 것은?",
      options: [
        { id: "1", content: "부담은 독립하여 쟁송의 대상이 될 수 있다", isCorrect: false },
        { id: "2", content: "조건은 행정행위의 효력 발생을 장래의 불확실한 사실에 의존케 하는 부관이다", isCorrect: false },
        { id: "3", content: "기한은 행정행위의 효력을 장래의 확실한 사실에 의존케 하는 부관이다", isCorrect: true },
        { id: "4", content: "철회권의 유보는 사후적 부관에 해당한다", isCorrect: false },
      ],
      correctAnswer: "3",
      explanation: "기한은 행정행위의 효력을 장래의 '확실한' 사실에 의존케 하는 부관이 아니라, 도래가 확실한 사실에 의존케 하는 부관입니다.",
      difficulty: 3,
      solveTime: 90,
      totalAttempts: 15000,
      correctCount: 9000,
      tags: ["부관", "조건", "기한"],
      aiHints: [],
      relatedQuestions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: "card-2",
    userId: "user-1",
    questionId: "q-2",
    easeFactor: 2.3,
    interval: 3,
    repetitions: 1,
    nextReviewAt: new Date(),
    lastReviewAt: new Date(Date.now() - 86400000 * 3),
    question: {
      id: "q-2",
      examType: "gosi_9",
      subject: "constitutional_law",
      chapter: "기본권",
      topic: "기본권의 주체",
      type: "multiple_choice",
      content: "헌법상 기본권의 주체에 관한 설명으로 옳은 것은?",
      options: [
        { id: "1", content: "법인은 성질상 법인에게 적용될 수 있는 기본권에 한하여 기본권 주체가 된다", isCorrect: true },
        { id: "2", content: "외국인은 모든 기본권의 주체가 될 수 없다", isCorrect: false },
        { id: "3", content: "태아는 어떠한 경우에도 기본권의 주체가 될 수 없다", isCorrect: false },
        { id: "4", content: "공법인은 어떠한 경우에도 기본권의 주체가 될 수 없다", isCorrect: false },
      ],
      correctAnswer: "1",
      explanation: "법인도 성질상 법인에게 적용될 수 있는 기본권에 한하여 기본권의 주체가 됩니다.",
      difficulty: 4,
      solveTime: 120,
      totalAttempts: 12000,
      correctCount: 7200,
      tags: ["기본권 주체", "법인", "외국인"],
      aiHints: [],
      relatedQuestions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

const mockStats = {
  totalCards: 156,
  dueToday: 23,
  newToday: 10,
  reviewedToday: 15,
  streak: 7,
  retention: 87,
};

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isReviewing, setIsReviewing] = useState(false);

  const recommendation = getReviewRecommendation(mockStats.dueToday);

  if (isReviewing) {
    return (
      <div className="container py-8 max-w-4xl">
        <SpacedRepetitionReview
          cards={mockDueCards}
          onCardReviewed={(cardId, quality, result) => {
            console.log("Card reviewed:", cardId, quality, result);
          }}
          onSessionComplete={(stats) => {
            console.log("Session complete:", stats);
            setIsReviewing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">스마트 복습</h1>
        <p className="text-muted-foreground">
          간격 반복 학습으로 장기 기억을 만들어보세요
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">대시보드</TabsTrigger>
          <TabsTrigger value="cards">내 카드</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Today's review */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">오늘의 복습</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {mockStats.dueToday}
                    </div>
                    <div className="text-sm text-muted-foreground">복습 예정</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {mockStats.reviewedToday}
                    </div>
                    <div className="text-sm text-muted-foreground">완료</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {mockStats.newToday}
                    </div>
                    <div className="text-sm text-muted-foreground">새 카드</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>오늘 진행률</span>
                      <span>
                        {mockStats.reviewedToday} / {mockStats.dueToday + mockStats.reviewedToday}
                      </span>
                    </div>
                    <Progress
                      value={
                        (mockStats.reviewedToday /
                          (mockStats.dueToday + mockStats.reviewedToday)) *
                        100
                      }
                      className="h-3"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {recommendation.message}
                  </p>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => setIsReviewing(true)}
                    disabled={mockStats.dueToday === 0}
                  >
                    {mockStats.dueToday > 0 ? "복습 시작하기" : "모든 복습 완료!"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">학습 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">총 카드</span>
                      <span className="font-semibold">{mockStats.totalCards}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">연속 학습</span>
                      <span className="font-semibold text-orange-500">
                        🔥 {mockStats.streak}일
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">기억 유지율</span>
                      <span className="font-semibold text-green-500">
                        {mockStats.retention}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">복습 예측</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>내일</span>
                      <Badge variant="outline">18개</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>모레</span>
                      <Badge variant="outline">12개</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>이번 주</span>
                      <Badge variant="outline">67개</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Subject breakdown */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">과목별 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { subject: "행정법", total: 45, due: 8, retention: 85 },
                  { subject: "헌법", total: 38, due: 5, retention: 90 },
                  { subject: "국어", total: 32, due: 6, retention: 78 },
                  { subject: "영어", total: 41, due: 4, retention: 82 },
                ].map((item) => (
                  <div
                    key={item.subject}
                    className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{item.subject}</span>
                      <Badge
                        variant={item.due > 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.due > 0 ? `${item.due}개 대기` : "완료"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      총 {item.total}개 카드
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.retention} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">
                        {item.retention}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">내 복습 카드</CardTitle>
                <Button>새 카드 추가</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDueCards.map((card) => {
                  const retention = calculateRetention(
                    card.easeFactor,
                    card.lastReviewAt
                      ? (Date.now() - new Date(card.lastReviewAt).getTime()) / 86400000
                      : 0,
                    card.interval
                  );

                  return (
                    <div
                      key={card.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {card.question.subject}
                            </Badge>
                            <Badge
                              className={
                                retention >= 80
                                  ? "bg-green-500"
                                  : retention >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }
                            >
                              {Math.round(retention)}% 기억
                            </Badge>
                          </div>
                          <p className="text-sm line-clamp-2">
                            {card.question.content}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-muted-foreground">다음 복습</div>
                          <div className="font-medium">
                            {formatInterval(card.interval)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">학습 히트맵</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  학습 히트맵이 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">기억 유지율 추이</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  기억 유지율 차트가 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
