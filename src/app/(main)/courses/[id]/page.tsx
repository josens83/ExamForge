"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  FileText,
  MessageCircle,
  CheckCircle,
  Shield,
  Award,
  ChevronDown,
  ChevronUp,
  Lock,
  PlayCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDuration } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Mock course data
const mockCourse = {
  id: "1",
  title: "2024 행정법 기본이론 완성",
  subtitle: "기초부터 심화까지 체계적인 강의",
  description: `행정법은 공무원 시험에서 가장 중요한 과목 중 하나입니다. 이 강의는 행정법의 기본 개념부터 심화 이론까지 체계적으로 다룹니다.

강의 특징:
- 판례 중심의 실전형 강의
- 출제 포인트 집중 분석
- 매 강의 후 OX 퀴즈 제공
- 1:1 질의응답 지원

이 강의를 통해 행정법의 기본기를 확실히 다지고, 실전에서 고득점을 달성할 수 있습니다.`,
  thumbnail:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  previewVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  instructor: {
    id: "1",
    name: "김행정",
    title: "행정법 전문 강사",
    avatar: "KH",
    bio: "서울대학교 법학과 졸업, 행정고시 합격, 15년 강의 경력",
    totalStudents: 45000,
    totalCourses: 12,
    avgRating: 4.8,
  },
  originalPrice: 350000,
  salePrice: 249000,
  saleEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  rating: 4.8,
  reviewCount: 1234,
  enrollmentCount: 5678,
  totalLessons: 48,
  totalDuration: 2400,
  level: "intermediate",
  examType: "gosi_9",
  courseType: "recorded",
  completionRate: 87,
  includes: [
    "PDF 교재 (300페이지)",
    "기출문제집 (500문제)",
    "1:1 질문 무제한",
    "수강기간 12개월",
    "모바일 수강 지원",
    "수료증 발급",
  ],
  chapters: [
    {
      id: "1",
      number: 1,
      title: "행정법 서론",
      lessons: [
        {
          id: "1",
          number: 1,
          title: "행정의 의의와 종류",
          duration: 45,
          isFree: true,
        },
        {
          id: "2",
          number: 2,
          title: "행정법의 의의와 특수성",
          duration: 50,
          isFree: true,
        },
        {
          id: "3",
          number: 3,
          title: "법치행정의 원리",
          duration: 55,
          isFree: false,
        },
        {
          id: "4",
          number: 4,
          title: "행정법의 법원",
          duration: 60,
          isFree: false,
        },
      ],
    },
    {
      id: "2",
      number: 2,
      title: "행정작용법",
      lessons: [
        {
          id: "5",
          number: 1,
          title: "행정입법 개관",
          duration: 50,
          isFree: false,
        },
        {
          id: "6",
          number: 2,
          title: "법규명령",
          duration: 55,
          isFree: false,
        },
        {
          id: "7",
          number: 3,
          title: "행정규칙",
          duration: 45,
          isFree: false,
        },
        {
          id: "8",
          number: 4,
          title: "행정행위의 의의",
          duration: 60,
          isFree: false,
        },
        {
          id: "9",
          number: 5,
          title: "행정행위의 종류",
          duration: 65,
          isFree: false,
        },
        {
          id: "10",
          number: 6,
          title: "행정행위의 부관",
          duration: 50,
          isFree: false,
        },
      ],
    },
    {
      id: "3",
      number: 3,
      title: "행정절차법",
      lessons: [
        {
          id: "11",
          number: 1,
          title: "행정절차법 총론",
          duration: 55,
          isFree: false,
        },
        {
          id: "12",
          number: 2,
          title: "처분절차",
          duration: 60,
          isFree: false,
        },
        {
          id: "13",
          number: 3,
          title: "신고와 확인",
          duration: 45,
          isFree: false,
        },
      ],
    },
  ],
  reviews: [
    {
      id: "1",
      userId: "user1",
      userName: "합격생A",
      rating: 5,
      content:
        "정말 좋은 강의입니다. 행정법이 어렵다고 생각했는데 김행정 선생님 강의 듣고 자신감이 생겼어요. 특히 판례 설명이 정말 명쾌합니다!",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isVerified: true,
    },
    {
      id: "2",
      userId: "user2",
      userName: "수험생B",
      rating: 5,
      content:
        "기본이론부터 차근차근 설명해주셔서 초보자도 따라가기 좋습니다. 교재도 잘 정리되어 있어요.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      isVerified: true,
    },
    {
      id: "3",
      userId: "user3",
      userName: "직장인C",
      rating: 4,
      content:
        "직장 다니면서 틈틈이 듣고 있는데, 강의 시간이 적당하고 핵심만 잘 짚어주세요.",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isVerified: true,
    },
  ],
};

function getLevelLabel(level: string) {
  const labels: Record<string, string> = {
    beginner: "입문",
    intermediate: "중급",
    advanced: "고급",
  };
  return labels[level] || level;
}

export default function CourseDetailPage() {
  const params = useParams();
  const [expandedChapters, setExpandedChapters] = useState<string[]>(["1"]);
  const course = mockCourse;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const totalLessonsInChapters = course.chapters.reduce(
    (acc, ch) => acc + ch.lessons.length,
    0
  );
  const totalDurationInChapters = course.chapters.reduce(
    (acc, ch) => acc + ch.lessons.reduce((a, l) => a + l.duration, 0),
    0
  );

  const discount = course.salePrice
    ? Math.round(
        ((course.originalPrice - course.salePrice) / course.originalPrice) * 100
      )
    : 0;

  return (
    <div className="container py-8">
      {/* Back button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          강의 목록
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">{getLevelLabel(course.level)}</Badge>
              <Badge variant="secondary">9급 공무원</Badge>
              {course.salePrice && (
                <Badge className="bg-red-500">{discount}% 할인</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              {course.subtitle}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
                <span className="text-muted-foreground">
                  ({course.reviewCount.toLocaleString()}개 리뷰)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {course.enrollmentCount.toLocaleString()}명 수강
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  총 {formatDuration(course.totalDuration)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {course.totalLessons}강
                </span>
              </div>
            </div>
          </div>

          {/* Preview video */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  미리보기 재생
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="curriculum" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="curriculum">커리큘럼</TabsTrigger>
              <TabsTrigger value="description">강의 소개</TabsTrigger>
              <TabsTrigger value="instructor">강사 소개</TabsTrigger>
              <TabsTrigger value="reviews">수강 후기</TabsTrigger>
            </TabsList>

            {/* Curriculum */}
            <TabsContent value="curriculum" className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  총 {course.chapters.length}개 챕터 /{" "}
                  {totalLessonsInChapters}강 /{" "}
                  {formatDuration(totalDurationInChapters)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedChapters(
                      expandedChapters.length === course.chapters.length
                        ? []
                        : course.chapters.map((c) => c.id)
                    )
                  }
                >
                  {expandedChapters.length === course.chapters.length
                    ? "모두 접기"
                    : "모두 펼치기"}
                </Button>
              </div>

              <div className="space-y-3">
                {course.chapters.map((chapter) => (
                  <Collapsible
                    key={chapter.id}
                    open={expandedChapters.includes(chapter.id)}
                    onOpenChange={() => toggleChapter(chapter.id)}
                  >
                    <Card>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-muted-foreground">
                                {chapter.number}장
                              </span>
                              <CardTitle className="text-base">
                                {chapter.title}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">
                                {chapter.lessons.length}강
                              </span>
                              {expandedChapters.includes(chapter.id) ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {chapter.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.isFree ? (
                                    <PlayCircle className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">
                                      {chapter.number}-{lesson.number}.{" "}
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {lesson.duration}분
                                    </p>
                                  </div>
                                </div>
                                {lesson.isFree && (
                                  <Badge variant="secondary" className="text-xs">
                                    무료 공개
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </TabsContent>

            {/* Description */}
            <TabsContent value="description">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">
                      {course.description}
                    </pre>
                  </div>

                  <Separator className="my-6" />

                  <h3 className="font-semibold mb-4">이 강의에 포함된 것</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.includes.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Instructor */}
            <TabsContent value="instructor">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">
                        {course.instructor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">
                        {course.instructor.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {course.instructor.title}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.instructor.avgRating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {course.instructor.totalStudents.toLocaleString()}명
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{course.instructor.totalCourses}개 강의</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{course.instructor.bio}</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews" className="space-y-4">
              {/* Rating summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{course.rating}</div>
                      <div className="flex items-center justify-center mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(course.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.reviewCount.toLocaleString()}개 리뷰
                      </p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-3">{rating}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <Progress
                            value={rating === 5 ? 75 : rating === 4 ? 20 : 5}
                            className="flex-1 h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review list */}
              {course.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {review.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {review.userName}
                            </span>
                            {review.isVerified && (
                              <Badge
                                variant="secondary"
                                className="text-xs gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                수강 인증
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </CardContent>
                </Card>
              ))}

              <Button variant="outline" className="w-full">
                더 많은 후기 보기
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Purchase card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Price */}
                <div>
                  {course.salePrice ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          {formatCurrency(course.salePrice)}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          {formatCurrency(course.originalPrice)}
                        </span>
                      </div>
                      <p className="text-sm text-red-500 mt-1">
                        {discount}% 할인 중 (
                        {Math.ceil(
                          (course.saleEndsAt!.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )}
                        일 남음)
                      </p>
                    </>
                  ) : (
                    <span className="text-3xl font-bold">
                      {formatCurrency(course.originalPrice)}
                    </span>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/checkout?type=course&id=${course.id}`}>
                      수강 신청하기
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    장바구니 담기
                  </Button>
                </div>

                <Separator />

                {/* Course info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">강의 수</span>
                    <span className="font-medium">{course.totalLessons}강</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">총 시간</span>
                    <span className="font-medium">
                      {formatDuration(course.totalDuration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">수강 기간</span>
                    <span className="font-medium">12개월</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">난이도</span>
                    <span className="font-medium">
                      {getLevelLabel(course.level)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">수료율</span>
                    <span className="font-medium">{course.completionRate}%</span>
                  </div>
                </div>

                <Separator />

                {/* Guarantee badges */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span>30일 환불 보장</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span>수료증 발급</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Download className="h-5 w-5 text-purple-500" />
                    <span>강의 자료 다운로드</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MessageCircle className="h-5 w-5 text-orange-500" />
                    <span>1:1 질의응답</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
