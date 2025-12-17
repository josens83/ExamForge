"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Flag,
  CheckCircle2,
  AlertCircle,
  Send,
  RotateCcw,
  List,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Eye,
  EyeOff,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock exam data
const mockExam = {
  id: "1",
  title: "2024년 9급 국가직 행정법 모의고사",
  examType: "gosi_9",
  subject: "행정법",
  year: 2024,
  round: 1,
  totalQuestions: 20,
  totalTime: 30, // minutes
  totalScore: 100,
  passingScore: 60,
  type: "predicted",
  difficulty: "medium",
  questions: [
    {
      id: "1",
      number: 1,
      content: "행정행위의 부관에 대한 설명으로 옳지 않은 것은?",
      options: [
        { id: "1", text: "부담은 그 자체로서 독립하여 행정쟁송의 대상이 될 수 있다." },
        { id: "2", text: "법률에 근거가 없으면 기속행위에는 부관을 붙일 수 없다." },
        { id: "3", text: "부관이 위법한 경우 부관만의 무효확인을 구할 수 있다." },
        { id: "4", text: "건축허가에 붙은 부담은 허가의 효력발생에 영향을 미친다." },
      ],
      correctAnswer: "4",
      score: 5,
    },
    {
      id: "2",
      number: 2,
      content: "행정절차법상 처분에 관한 설명으로 옳은 것은?",
      options: [
        { id: "1", text: "모든 처분에는 반드시 이유를 제시하여야 한다." },
        { id: "2", text: "처분 전 사전통지는 예외 없이 반드시 하여야 한다." },
        { id: "3", text: "청문은 당사자의 신청이 있어야만 실시할 수 있다." },
        { id: "4", text: "처분의 사전통지는 서면으로 하는 것이 원칙이다." },
      ],
      correctAnswer: "4",
      score: 5,
    },
    {
      id: "3",
      number: 3,
      content: "행정소송법상 취소소송의 대상인 처분에 관한 설명으로 옳지 않은 것은?",
      options: [
        { id: "1", text: "처분성 판단은 형식적 행위형식이 아닌 실질적 기준에 의한다." },
        { id: "2", text: "국민의 권리의무에 직접 영향을 미치는 행위여야 한다." },
        { id: "3", text: "행정청의 일반적·추상적 규율은 처분에 해당하지 않는다." },
        { id: "4", text: "권력적 사실행위도 처분에 해당할 수 없다." },
      ],
      correctAnswer: "4",
      score: 5,
    },
    {
      id: "4",
      number: 4,
      content: "행정심판법상 행정심판에 관한 설명으로 옳은 것은?",
      options: [
        { id: "1", text: "행정심판위원회는 처분의 위법 여부만 심리할 수 있다." },
        { id: "2", text: "취소심판의 청구기간은 처분이 있음을 안 날부터 180일이다." },
        { id: "3", text: "행정심판은 서면심리가 원칙이다." },
        { id: "4", text: "행정심판을 거치지 않으면 행정소송을 제기할 수 없다." },
      ],
      correctAnswer: "3",
      score: 5,
    },
    {
      id: "5",
      number: 5,
      content: "국가배상법상 국가배상에 관한 설명으로 옳지 않은 것은?",
      options: [
        { id: "1", text: "공무원의 고의 또는 과실이 요건이다." },
        { id: "2", text: "직무행위의 외형을 갖춘 행위도 포함된다." },
        { id: "3", text: "배상책임의 본질은 자기책임설이 통설이다." },
        { id: "4", text: "영조물의 설치·관리의 하자로 인한 손해도 배상대상이다." },
      ],
      correctAnswer: "3",
      score: 5,
    },
  ],
};

type ExamStatus = "ready" | "in_progress" | "submitted" | "reviewed";

interface Answer {
  questionId: string;
  answer: string | null;
  flagged: boolean;
  timeSpent: number;
}

export default function MockExamPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<ExamStatus>("ready");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(mockExam.totalTime * 60);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const exam = mockExam;
  const question = exam.questions[currentQuestion];
  const totalQuestions = exam.questions.length;

  // Initialize answers
  useEffect(() => {
    if (answers.length === 0) {
      setAnswers(
        exam.questions.map((q) => ({
          questionId: q.id,
          answer: null,
          flagged: false,
          timeSpent: 0,
        }))
      );
    }
  }, [exam.questions, answers.length]);

  // Timer
  useEffect(() => {
    if (status !== "in_progress") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    setStatus("in_progress");
  };

  const handleAnswer = (answerId: string) => {
    setAnswers((prev) =>
      prev.map((a, idx) =>
        idx === currentQuestion ? { ...a, answer: answerId } : a
      )
    );
  };

  const handleFlag = () => {
    setAnswers((prev) =>
      prev.map((a, idx) =>
        idx === currentQuestion ? { ...a, flagged: !a.flagged } : a
      )
    );
  };

  const handleSubmit = useCallback(() => {
    setStatus("submitted");
    setShowResults(true);
  }, []);

  const handleReview = () => {
    setStatus("reviewed");
    setShowResults(false);
    setCurrentQuestion(0);
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setShowQuestionList(false);
  };

  const answeredCount = answers.filter((a) => a.answer !== null).length;
  const flaggedCount = answers.filter((a) => a.flagged).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // Calculate results
  const calculateResults = () => {
    let correct = 0;
    let totalScore = 0;

    exam.questions.forEach((q, idx) => {
      if (answers[idx]?.answer === q.correctAnswer) {
        correct++;
        totalScore += q.score;
      }
    });

    return {
      correct,
      wrong: totalQuestions - correct,
      score: totalScore,
      percentage: Math.round((totalScore / exam.totalScore) * 100),
      passed: totalScore >= exam.passingScore,
    };
  };

  // Ready state
  if (status === "ready") {
    return (
      <div className="container max-w-2xl py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/mock-exams">
            <ArrowLeft className="mr-2 h-4 w-4" />
            모의고사 목록
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{exam.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">문항 수</p>
                <p className="font-medium">{exam.totalQuestions}문항</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">제한 시간</p>
                <p className="font-medium">{exam.totalTime}분</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">총점</p>
                <p className="font-medium">{exam.totalScore}점</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">합격 기준</p>
                <p className="font-medium">{exam.passingScore}점 이상</p>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                유의사항
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>- 시험 시작 후에는 중단할 수 없습니다.</li>
                <li>- 제한 시간이 지나면 자동으로 제출됩니다.</li>
                <li>- 답안 제출 후에는 수정할 수 없습니다.</li>
                <li>- 안정적인 인터넷 연결을 확인해 주세요.</li>
              </ul>
            </div>

            <Button className="w-full" size="lg" onClick={handleStart}>
              시험 시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results dialog
  if (showResults) {
    const results = calculateResults();

    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {results.passed ? (
                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-green-500" />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Target className="h-10 w-10 text-orange-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {results.passed ? "축하합니다! 합격입니다" : "아쉽지만 불합격입니다"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score display */}
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">
                {results.score}
                <span className="text-2xl text-muted-foreground">
                  /{exam.totalScore}점
                </span>
              </div>
              <p className="text-muted-foreground mt-2">
                상위 {100 - results.percentage}% (예상)
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {results.correct}
                </div>
                <p className="text-sm text-muted-foreground">정답</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-red-500">
                  {results.wrong}
                </div>
                <p className="text-sm text-muted-foreground">오답</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">
                  {formatTime(exam.totalTime * 60 - timeLeft)}
                </div>
                <p className="text-sm text-muted-foreground">소요 시간</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button onClick={handleReview} className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                오답 분석 및 해설 보기
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/mock-exams">모의고사 목록으로</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam or review state
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet open={showQuestionList} onOpenChange={setShowQuestionList}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <List className="mr-2 h-4 w-4" />
                    문제 목록
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>문제 목록</SheetTitle>
                    <SheetDescription>
                      {answeredCount}/{totalQuestions} 완료
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid grid-cols-5 gap-2 mt-6">
                    {exam.questions.map((q, idx) => {
                      const answer = answers[idx];
                      const isCorrect =
                        status === "reviewed" && answer?.answer === q.correctAnswer;
                      const isWrong =
                        status === "reviewed" &&
                        answer?.answer !== null &&
                        answer?.answer !== q.correctAnswer;

                      return (
                        <Button
                          key={q.id}
                          variant={idx === currentQuestion ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "h-10 w-10 p-0",
                            answer?.flagged && "ring-2 ring-orange-500",
                            isCorrect && "bg-green-500 hover:bg-green-600",
                            isWrong && "bg-red-500 hover:bg-red-600"
                          )}
                          onClick={() => goToQuestion(idx)}
                        >
                          {q.number}
                        </Button>
                      );
                    })}
                  </div>
                  <div className="mt-6 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border bg-muted" />
                      <span>미답변</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-primary" />
                      <span>답변 완료</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border ring-2 ring-orange-500" />
                      <span>체크한 문제</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div>
                <p className="text-sm font-medium">{exam.title}</p>
                <p className="text-xs text-muted-foreground">
                  {currentQuestion + 1} / {totalQuestions}
                </p>
              </div>
            </div>

            {status === "in_progress" && (
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex items-center gap-2 font-mono text-lg font-bold",
                    timeLeft < 300 && "text-red-500"
                  )}
                >
                  <Clock className="h-5 w-5" />
                  {formatTime(timeLeft)}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      제출하기
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>시험을 제출하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {answeredCount < totalQuestions && (
                          <span className="text-orange-500">
                            아직 {totalQuestions - answeredCount}문제가 미답변
                            상태입니다.
                          </span>
                        )}
                        {flaggedCount > 0 && (
                          <span className="block mt-1">
                            체크한 문제가 {flaggedCount}개 있습니다.
                          </span>
                        )}
                        <span className="block mt-2">
                          제출 후에는 답안을 수정할 수 없습니다.
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>
                        제출하기
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {status === "reviewed" && (
              <Button variant="outline" asChild>
                <Link href="/mock-exams">목록으로</Link>
              </Button>
            )}
          </div>

          {/* Progress bar */}
          <Progress value={progress} className="h-1 mt-3" />
        </div>
      </div>

      {/* Question content */}
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">문제 {question.number}</Badge>
                <Badge variant="secondary">{question.score}점</Badge>
                {answers[currentQuestion]?.flagged && (
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
                    체크됨
                  </Badge>
                )}
              </div>
              {status === "in_progress" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFlag}
                  className={cn(
                    answers[currentQuestion]?.flagged && "text-orange-500"
                  )}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question text */}
            <p className="text-lg leading-relaxed">{question.content}</p>

            {/* Options */}
            <RadioGroup
              value={answers[currentQuestion]?.answer || ""}
              onValueChange={handleAnswer}
              disabled={status !== "in_progress"}
            >
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[currentQuestion]?.answer === option.id;
                  const isCorrect =
                    status === "reviewed" && option.id === question.correctAnswer;
                  const isWrongSelected =
                    status === "reviewed" &&
                    isSelected &&
                    option.id !== question.correctAnswer;

                  return (
                    <div
                      key={option.id}
                      className={cn(
                        "flex items-start space-x-3 rounded-lg border p-4 transition-colors",
                        status === "in_progress" && isSelected && "border-primary bg-primary/5",
                        status === "in_progress" && !isSelected && "hover:bg-muted/50",
                        isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/30",
                        isWrongSelected && "border-red-500 bg-red-50 dark:bg-red-950/30"
                      )}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={`option-${option.id}`}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer leading-relaxed"
                      >
                        <span className="font-medium mr-2">
                          {String.fromCharCode(9312 + index)}
                        </span>
                        {option.text}
                      </Label>
                      {isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                      {isWrongSelected && (
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            {/* Explanation in review mode */}
            {status === "reviewed" && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">해설</h4>
                <p className="text-sm text-muted-foreground">
                  정답은 {question.correctAnswer}번입니다.
                  {question.options[Number(question.correctAnswer) - 1].text}이(가)
                  올바른 설명입니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            이전 문제
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentQuestion + 1} / {totalQuestions}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setCurrentQuestion((prev) => Math.min(totalQuestions - 1, prev + 1))
            }
            disabled={currentQuestion === totalQuestions - 1}
          >
            다음 문제
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
