"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  calculateSM2,
  answerToQuality,
  formatInterval,
  getDifficultyLabel,
} from "@/lib/spaced-repetition";
import { Question, SpacedRepetitionCard, SpacedRepetitionQuality } from "@/types";

interface ReviewCard extends SpacedRepetitionCard {
  question: Question;
}

interface SpacedRepetitionReviewProps {
  cards: ReviewCard[];
  onCardReviewed?: (
    cardId: string,
    quality: SpacedRepetitionQuality,
    result: {
      easeFactor: number;
      interval: number;
      repetitions: number;
      nextReviewDate: Date;
    }
  ) => void;
  onSessionComplete?: (stats: SessionStats) => void;
}

interface SessionStats {
  totalReviewed: number;
  correctCount: number;
  incorrectCount: number;
  averageTime: number;
  xpEarned: number;
}

type ReviewState = "question" | "answer" | "rating";

export function SpacedRepetitionReview({
  cards,
  onCardReviewed,
  onSessionComplete,
}: SpacedRepetitionReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewState, setReviewState] = useState<ReviewState>("question");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalReviewed: 0,
    correctCount: 0,
    incorrectCount: 0,
    averageTime: 0,
    xpEarned: 0,
  });

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  // Reset timer when moving to new question
  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  if (!currentCard) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <span className="text-6xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold mb-2">복습 완료!</h2>
          <p className="text-muted-foreground mb-6">
            오늘의 복습을 모두 마쳤습니다.
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sessionStats.correctCount}
              </div>
              <div className="text-sm text-muted-foreground">정답</div>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {sessionStats.incorrectCount}
              </div>
              <div className="text-sm text-muted-foreground">오답</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            획득 XP: +{sessionStats.xpEarned}
          </div>
          <Button onClick={() => onSessionComplete?.(sessionStats)}>
            완료
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = currentCard.question;
  const difficulty = getDifficultyLabel(currentCard.easeFactor);

  const handleShowAnswer = () => {
    setReviewState("answer");
  };

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
    setReviewState("answer");
  };

  const handleRating = (quality: SpacedRepetitionQuality) => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const isCorrect = quality >= 3;

    // Calculate new spaced repetition parameters
    const result = calculateSM2({
      quality,
      easeFactor: currentCard.easeFactor,
      interval: currentCard.interval,
      repetitions: currentCard.repetitions,
    });

    // Update session stats
    setSessionStats((prev) => ({
      totalReviewed: prev.totalReviewed + 1,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: prev.incorrectCount + (isCorrect ? 0 : 1),
      averageTime:
        (prev.averageTime * prev.totalReviewed + timeSpent) /
        (prev.totalReviewed + 1),
      xpEarned: prev.xpEarned + (isCorrect ? 10 : 3),
    }));

    // Notify parent
    onCardReviewed?.(currentCard.id, quality, result);

    // Move to next card
    setCurrentIndex((prev) => prev + 1);
    setReviewState("question");
    setSelectedAnswer(null);
  };

  const handleAutoRate = () => {
    // Auto-determine quality based on answer correctness and time
    const timeSpent = (Date.now() - startTime) / 1000;
    const options = question.options || [];
    const correctOption = options.find((o) => o.isCorrect);
    const isCorrect = selectedAnswer === correctOption?.id;

    const quality = answerToQuality(
      isCorrect,
      timeSpent,
      question.solveTime,
      "medium"
    );

    handleRating(quality);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentIndex + 1} / {cards.length}
            </Badge>
            <Badge
              className={cn(
                difficulty.color === "green" && "bg-green-500",
                difficulty.color === "yellow" && "bg-yellow-500",
                difficulty.color === "orange" && "bg-orange-500",
                difficulty.color === "red" && "bg-red-500"
              )}
            >
              {difficulty.label}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            다음 복습: {formatInterval(currentCard.interval)}
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="pt-6">
        {/* Question */}
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">
            {question.subject} &gt; {question.chapter || "일반"}
          </div>
          <p className="text-lg whitespace-pre-wrap">{question.content}</p>
        </div>

        {/* Options - Multiple Choice */}
        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2 mb-6">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const showResult = reviewState === "answer";
              const isCorrect = option.isCorrect;

              return (
                <button
                  key={option.id}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all",
                    reviewState === "question" && "hover:bg-muted cursor-pointer",
                    isSelected && !showResult && "border-primary bg-primary/5",
                    showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                    showResult && "cursor-default"
                  )}
                  onClick={() => {
                    if (reviewState === "question") {
                      handleSelectAnswer(option.id);
                    }
                  }}
                  disabled={reviewState !== "question"}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-sm">
                      {option.id}
                    </span>
                    <span className="flex-1">{option.content}</span>
                    {showResult && isCorrect && (
                      <span className="text-green-500">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Show Answer Button */}
        {reviewState === "question" && !selectedAnswer && (
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={handleShowAnswer}
          >
            정답 보기
          </Button>
        )}

        {/* Explanation */}
        {reviewState === "answer" && question.explanation && (
          <div className="p-4 bg-muted rounded-lg mb-6">
            <div className="text-sm font-medium mb-2">해설</div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Rating Buttons */}
        {reviewState === "answer" && (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              이 문제가 얼마나 어려웠나요?
            </div>

            {/* Quick auto-rate based on answer */}
            {selectedAnswer && (
              <Button
                className="w-full mb-4"
                onClick={handleAutoRate}
              >
                다음 문제로
              </Button>
            )}

            {/* Manual rating options */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => handleRating(0)}
              >
                <span className="text-lg">😵</span>
                <span className="text-xs">모르겠음</span>
                <span className="text-xs text-muted-foreground">1일</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-orange-500 text-orange-500 hover:bg-orange-50"
                onClick={() => handleRating(2)}
              >
                <span className="text-lg">😓</span>
                <span className="text-xs">어려움</span>
                <span className="text-xs text-muted-foreground">1일</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => handleRating(3)}
              >
                <span className="text-lg">🤔</span>
                <span className="text-xs">보통</span>
                <span className="text-xs text-muted-foreground">
                  {formatInterval(
                    Math.round(currentCard.interval * currentCard.easeFactor * 0.7)
                  )}
                </span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-green-500 text-green-500 hover:bg-green-50"
                onClick={() => handleRating(5)}
              >
                <span className="text-lg">😊</span>
                <span className="text-xs">쉬움</span>
                <span className="text-xs text-muted-foreground">
                  {formatInterval(
                    Math.round(currentCard.interval * currentCard.easeFactor)
                  )}
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
