"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Clock,
  Target,
  MessageCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Share2,
  Flag,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock question data
const mockQuestion = {
  id: "1",
  subject: "행정법",
  topic: "행정행위",
  chapter: "제3장 행정작용법",
  examType: "gosi_9",
  content: `행정행위의 부관에 대한 설명으로 옳지 않은 것은? (다툼이 있는 경우 판례에 의함)`,
  type: "multiple_choice",
  options: [
    {
      id: "1",
      text: "부담은 그 자체로서 독립하여 행정쟁송의 대상이 될 수 있다.",
    },
    {
      id: "2",
      text: "법률에 근거가 없으면 기속행위에는 부관을 붙일 수 없으나, 재량행위에는 부관을 붙일 수 있다.",
    },
    {
      id: "3",
      text: "부관이 위법하고 그 위법이 중대·명백하여 당연무효인 경우에는 부관만의 무효확인을 구할 수 있다.",
    },
    {
      id: "4",
      text: "건축허가에 붙은 부관으로서 허가 후 담장을 설치하라는 부담은 건축허가의 효력발생에 영향을 미친다.",
    },
  ],
  correctAnswer: "4",
  difficulty: 3,
  solveTime: 90,
  totalAttempts: 15420,
  correctCount: 10331,
  year: 2023,
  source: "9급 국가직",
  explanation: `정답: ④

[해설]
① (O) 부담은 주된 행정행위와 별개의 독립된 처분으로서 그 자체로서 독립하여 행정쟁송의 대상이 될 수 있다. (대판 2009.2.12, 2005두1321)

② (O) 기속행위에는 법률에 특별한 근거가 있는 경우에만 부관을 붙일 수 있고, 재량행위에는 법률에 특별한 근거가 없더라도 그 재량권의 범위 내에서 부관을 붙일 수 있다. (대판 2004.3.25, 2003두12837)

③ (O) 부관이 위법하고 그 위법이 중대·명백하여 당연무효인 경우에는 부관만의 무효확인을 구할 수 있다. (대판 1997.3.11, 96다49650)

④ (X) 건축허가에 붙은 부담은 건축허가의 효력발생에 영향을 미치지 아니한다. 부담은 주된 행정행위의 효력발생과는 별도로 상대방에게 작위·부작위·급부·수인 등의 의무를 명하는 종된 규율이므로, 부담의 불이행은 주된 행정행위의 철회사유가 될 수 있을 뿐 그 효력발생에는 영향을 미치지 않는다.`,
  aiHints: [
    "부관의 종류(조건, 기한, 부담, 철회권유보)와 각각의 특징을 구별하세요.",
    "부담은 '독립쟁송가능성'이 있다는 점이 핵심입니다.",
    "부담 불이행 시 '철회사유'가 될 수 있다는 것과 '효력발생'에 영향을 미치는 것은 다릅니다.",
  ],
  relatedQuestions: ["2", "5", "8"],
  tags: ["행정행위", "부관", "부담", "기속행위", "재량행위"],
};

function getDifficultyLabel(difficulty: number) {
  const labels: Record<number, string> = {
    1: "매우 쉬움",
    2: "쉬움",
    3: "보통",
    4: "어려움",
    5: "매우 어려움",
  };
  return labels[difficulty] || "보통";
}

function getDifficultyColor(difficulty: number) {
  const colors: Record<number, string> = {
    1: "bg-green-500",
    2: "bg-lime-500",
    3: "bg-yellow-500",
    4: "bg-orange-500",
    5: "bg-red-500",
  };
  return colors[difficulty] || "bg-yellow-500";
}

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const question = mockQuestion;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const correctRate = Math.round(
    (question.correctCount / question.totalAttempts) * 100
  );

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswer("");
    setIsSubmitted(false);
    setShowHints(false);
  };

  const handleNext = () => {
    // Navigate to next question
    router.push(`/questions/${Number(params.id) + 1}`);
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/questions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            문제 목록
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Flag className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Question Info */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="outline">{question.subject}</Badge>
        <Badge variant="secondary">{question.topic}</Badge>
        <div className="flex items-center gap-1">
          <span
            className={cn("h-2 w-2 rounded-full", getDifficultyColor(question.difficulty))}
          />
          <span className="text-xs text-muted-foreground">
            {getDifficultyLabel(question.difficulty)}
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          {question.year} {question.source}
        </Badge>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          평균 {question.solveTime}초
        </div>
        <div className="flex items-center gap-1">
          <Target className="h-4 w-4" />
          정답률 {correctRate}%
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          {question.totalAttempts.toLocaleString()}명 풀이
        </div>
      </div>

      {/* Question Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">
            {question.content}
          </p>
        </CardContent>
      </Card>

      {/* Answer Options */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={isSubmitted}
          >
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectAnswer = option.id === question.correctAnswer;
                let optionStyle = "";

                if (isSubmitted) {
                  if (isCorrectAnswer) {
                    optionStyle =
                      "border-green-500 bg-green-50 dark:bg-green-950/30";
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle = "border-red-500 bg-red-50 dark:bg-red-950/30";
                  }
                }

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-start space-x-3 rounded-lg border p-4 transition-colors",
                      !isSubmitted && isSelected && "border-primary bg-primary/5",
                      !isSubmitted && !isSelected && "hover:bg-muted/50",
                      optionStyle
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
                    {isSubmitted && isCorrectAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrectAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isSubmitted ? (
        <div className="flex items-center justify-between gap-4 mb-6">
          <Collapsible open={showHints} onOpenChange={setShowHints}>
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                <Lightbulb className="mr-2 h-4 w-4" />
                힌트 보기
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          <Button onClick={handleSubmit} disabled={!selectedAnswer} size="lg">
            정답 확인
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            다시 풀기
          </Button>
          <Button onClick={handleNext} size="lg">
            다음 문제
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hints Section */}
      <Collapsible open={showHints} onOpenChange={setShowHints}>
        <CollapsibleContent>
          <Card className="mb-6 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                힌트
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {question.aiHints.map((hint, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-yellow-500 font-medium">
                      {index + 1}.
                    </span>
                    {hint}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Result & Explanation */}
      {isSubmitted && (
        <>
          {/* Result Banner */}
          <Card
            className={cn(
              "mb-6",
              isCorrect
                ? "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                : "border-red-500 bg-red-50/50 dark:bg-red-950/20"
            )}
          >
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                {isCorrect ? (
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
                <div>
                  <h3 className="text-xl font-bold">
                    {isCorrect ? "정답입니다!" : "오답입니다"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isCorrect
                      ? "훌륭해요! 계속 이 조자로 학습하세요."
                      : `정답은 ${question.correctAnswer}번입니다. 해설을 확인해보세요.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explanation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">해설</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {question.explanation}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI 튜터 설명
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAIExplanation(!showAIExplanation)}
                >
                  {showAIExplanation ? "접기" : "AI 설명 보기"}
                </Button>
              </div>
            </CardHeader>
            {showAIExplanation && (
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p>
                    이 문제는 <strong>행정행위의 부관</strong>에 대한 이해를
                    묻는 문제입니다. 특히 <strong>부담</strong>의 성질과 효과에
                    대해 정확히 알고 있어야 합니다.
                  </p>
                  <p>
                    부관에는 조건, 기한, 부담, 철회권유보 등이 있는데, 이 중
                    부담은 다른 부관과 달리 <strong>독립쟁송</strong>이
                    가능합니다. 이는 부담이 주된 행정행위와 별개의 독립된
                    처분으로서의 성격을 갖기 때문입니다.
                  </p>
                  <p>
                    4번 선지가 틀린 이유는, 부담의 불이행이 주된 행정행위의
                    <strong>철회사유</strong>가 될 수 있을 뿐, 그{" "}
                    <strong>효력발생</strong> 자체에는 영향을 미치지 않기
                    때문입니다. 이 점을 조건과 혼동하지 않도록 주의하세요.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    더 궁금한 점이 있으신가요?
                  </p>
                  <Textarea
                    placeholder="AI 튜터에게 질문하세요..."
                    className="resize-none"
                    rows={2}
                  />
                  <Button className="mt-2" size="sm">
                    질문하기
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Related Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">관련 문제</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {question.relatedQuestions.map((qId) => (
                  <Link
                    key={qId}
                    href={`/questions/${qId}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">관련 문제 #{qId}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
