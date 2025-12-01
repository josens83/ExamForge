"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Clock,
  Users,
  Star,
  Play,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDuration } from "@/lib/utils";

// Mock courses data
const mockCourses = [
  {
    id: "1",
    title: "2024 행정법 기본이론 완성",
    subtitle: "기초부터 심화까지 체계적인 강의",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    instructor: { name: "김행정", avatar: "KH" },
    originalPrice: 350000,
    salePrice: 249000,
    rating: 4.8,
    reviewCount: 1234,
    enrollmentCount: 5678,
    totalLessons: 48,
    totalDuration: 2400,
    level: "intermediate",
    examType: "gosi_9",
    courseType: "recorded",
    includes: ["PDF 교재", "문제집", "1:1 질문"],
    isBestseller: true,
  },
  {
    id: "2",
    title: "헌법 핵심정리 특강",
    subtitle: "출제 포인트만 골라 정리",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    instructor: { name: "박헌법", avatar: "PH" },
    originalPrice: 200000,
    salePrice: 159000,
    rating: 4.9,
    reviewCount: 856,
    enrollmentCount: 3421,
    totalLessons: 24,
    totalDuration: 1200,
    level: "advanced",
    examType: "gosi_7",
    courseType: "recorded",
    includes: ["PDF 교재", "모의고사 3회"],
    isBestseller: false,
  },
  {
    id: "3",
    title: "국어 만점 전략 종합반",
    subtitle: "비문학, 문학, 문법 완전 정복",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    instructor: { name: "이국어", avatar: "LK" },
    originalPrice: 400000,
    salePrice: 299000,
    rating: 4.7,
    reviewCount: 2156,
    enrollmentCount: 8932,
    totalLessons: 60,
    totalDuration: 3000,
    level: "beginner",
    examType: "gosi_9",
    courseType: "recorded",
    includes: ["PDF 교재", "문제집", "첨삭 5회"],
    isBestseller: true,
  },
  {
    id: "4",
    title: "영어 독해 스킬업",
    subtitle: "빠른 독해와 정확한 해석",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80",
    instructor: { name: "최영어", avatar: "CE" },
    originalPrice: 280000,
    salePrice: null,
    rating: 4.6,
    reviewCount: 743,
    enrollmentCount: 2876,
    totalLessons: 36,
    totalDuration: 1800,
    level: "intermediate",
    examType: "gosi_9",
    courseType: "recorded",
    includes: ["PDF 교재", "단어장"],
    isBestseller: false,
  },
  {
    id: "5",
    title: "9급 합격보장반 (2024)",
    subtitle: "조건 충족 시 100% 환불 보장",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    instructor: { name: "합격팀", avatar: "HT" },
    originalPrice: 2000000,
    salePrice: 1500000,
    rating: 4.9,
    reviewCount: 432,
    enrollmentCount: 1234,
    totalLessons: 200,
    totalDuration: 10000,
    level: "intermediate",
    examType: "gosi_9",
    courseType: "omo",
    includes: ["전 과목 강의", "교재 전체", "1:1 멘토링", "스터디 그룹"],
    isBestseller: true,
    isGuaranteed: true,
  },
];

const examTypes = [
  { value: "all", label: "전체" },
  { value: "gosi_9", label: "9급 공무원" },
  { value: "gosi_7", label: "7급 공무원" },
  { value: "police", label: "경찰공무원" },
];

const sortOptions = [
  { value: "popular", label: "인기순" },
  { value: "rating", label: "평점순" },
  { value: "newest", label: "최신순" },
  { value: "price", label: "가격순" },
];

export default function CoursesPage() {
  const [selectedExam, setSelectedExam] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">강의</h1>
        <p className="text-muted-foreground mt-2">
          최고의 강사진과 함께 체계적으로 학습하세요
        </p>
      </div>

      {/* Featured course */}
      <Card className="mb-8 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="Featured course"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <Badge className="absolute top-4 left-4 bg-orange-500">
              합격보장
            </Badge>
          </div>
          <CardContent className="p-6 md:p-8 flex flex-col justify-center">
            <Badge variant="outline" className="w-fit mb-4">
              2024 신규 오픈
            </Badge>
            <h2 className="text-2xl font-bold mb-2">
              9급 공무원 합격보장반 (2024)
            </h2>
            <p className="text-muted-foreground mb-4">
              조건 충족 시 100% 환불을 보장하는 프리미엄 종합반입니다. 전 과목
              기본이론부터 파이널까지 완벽하게 준비하세요.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9</span>
                <span className="text-muted-foreground">(432)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">1,234명 수강</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(1500000)}
                </span>
                <span className="text-muted-foreground line-through ml-2">
                  {formatCurrency(2000000)}
                </span>
              </div>
              <Button asChild>
                <Link href="/courses/5">
                  자세히 보기
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="강의 검색..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">전체 강의</TabsTrigger>
          <TabsTrigger value="basic">기본이론</TabsTrigger>
          <TabsTrigger value="advanced">심화</TabsTrigger>
          <TabsTrigger value="package">종합반</TabsTrigger>
          <TabsTrigger value="guaranteed">합격보장</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {course.isBestseller && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        베스트셀러
                      </Badge>
                    )}
                    {course.isGuaranteed && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        합격보장
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm">
                        <Play className="mr-1 h-4 w-4" />
                        미리보기
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">
                        {course.instructor.avatar}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {course.instructor.name}
                      </span>
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                      {course.subtitle}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                        <span>({course.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(course.totalDuration)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div>
                      {course.salePrice ? (
                        <>
                          <span className="font-bold text-primary">
                            {formatCurrency(course.salePrice)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through ml-2">
                            {formatCurrency(course.originalPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {formatCurrency(course.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollmentCount.toLocaleString()}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="basic">
          <div className="text-center py-12">
            <p className="text-muted-foreground">기본이론 강의 목록</p>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="text-center py-12">
            <p className="text-muted-foreground">심화 강의 목록</p>
          </div>
        </TabsContent>

        <TabsContent value="package">
          <div className="text-center py-12">
            <p className="text-muted-foreground">종합반 강의 목록</p>
          </div>
        </TabsContent>

        <TabsContent value="guaranteed">
          <div className="text-center py-12">
            <p className="text-muted-foreground">합격보장 강의 목록</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
