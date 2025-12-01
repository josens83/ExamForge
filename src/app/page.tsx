import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Brain,
  Trophy,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Flame,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: BookOpen,
    title: "10만+ 무료 문제",
    description:
      "공무원, 자격증 시험 대비 방대한 문제은행을 무료로 제공합니다.",
  },
  {
    icon: Brain,
    title: "AI 맞춤 학습",
    description:
      "AI가 취약 영역을 분석하고 최적화된 학습 경로를 제안합니다.",
  },
  {
    icon: Zap,
    title: "AI 논술 채점",
    description:
      "Claude AI가 논술 답안을 즉시 채점하고 상세한 피드백을 제공합니다.",
  },
  {
    icon: Trophy,
    title: "합격보장반",
    description:
      "체계적인 커리큘럼과 조건 충족 시 100% 환불을 보장합니다.",
  },
  {
    icon: TrendingUp,
    title: "실시간 성적 분석",
    description: "학습 데이터를 기반으로 예상 점수와 합격 가능성을 분석합니다.",
  },
  {
    icon: Users,
    title: "스터디 그룹",
    description:
      "같은 목표를 가진 수험생들과 함께 공부하며 동기부여를 받으세요.",
  },
];

const examTypes = [
  { name: "9급 공무원", count: "32,450문제", color: "bg-blue-500" },
  { name: "7급 공무원", count: "28,320문제", color: "bg-indigo-500" },
  { name: "경찰공무원", count: "18,650문제", color: "bg-purple-500" },
  { name: "소방공무원", count: "15,890문제", color: "bg-red-500" },
  { name: "교원임용", count: "22,100문제", color: "bg-green-500" },
  { name: "자격증", count: "45,200문제", color: "bg-orange-500" },
];

const stats = [
  { value: "10만+", label: "무료 문제" },
  { value: "50만+", label: "누적 회원" },
  { value: "92%", label: "합격률" },
  { value: "4.9", label: "평점" },
];

const testimonials = [
  {
    name: "김도훈",
    role: "9급 합격",
    content:
      "AI가 제 취약점을 정확히 짚어줘서 효율적으로 공부할 수 있었어요. 덕분에 1년 만에 합격했습니다!",
    avatar: "KD",
  },
  {
    name: "이서연",
    role: "7급 합격",
    content:
      "논술 채점 기능이 정말 혁신적이에요. 즉각적인 피드백으로 빠르게 실력이 늘었습니다.",
    avatar: "LS",
  },
  {
    name: "박준혁",
    role: "경찰공무원 합격",
    content:
      "모의고사와 실시간 순위 기능이 실전 감각을 키우는데 큰 도움이 됐어요.",
    avatar: "PJ",
  },
];

const pricingPlans = [
  {
    name: "무료",
    price: "0",
    description: "기본 학습 기능",
    features: [
      "일 30문제 풀이",
      "월 1회 모의고사",
      "기본 학습 분석",
      "오답노트",
    ],
    cta: "무료로 시작하기",
    popular: false,
  },
  {
    name: "프리미엄",
    price: "29,900",
    period: "/월",
    description: "본격적인 시험 준비",
    features: [
      "무제한 문제 풀이",
      "무제한 모의고사",
      "AI 논술채점 50회",
      "심화 분석 리포트",
      "오프라인 다운로드",
      "우선 고객지원",
    ],
    cta: "프리미엄 시작하기",
    popular: true,
  },
  {
    name: "VIP",
    price: "99,900",
    period: "/월",
    description: "합격을 위한 올인원",
    features: [
      "프리미엄 모든 기능",
      "무제한 AI 논술채점",
      "1:1 멘토링 월 1시간",
      "전용 스터디 그룹",
      "합격보장반 20% 할인",
      "프리미엄 강의 할인",
    ],
    cta: "VIP 시작하기",
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Flame className="mr-1 h-3 w-3 text-orange-500" />
                지금 가입하면 7일 프리미엄 무료 체험
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                AI와 함께하는
                <br />
                <span className="text-primary">스마트한 시험 준비</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                10만개 이상의 무료 문제와 AI 맞춤 학습으로
                <br className="hidden sm:inline" />
                합격까지 가장 빠른 길을 안내합니다
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" asChild>
                  <Link href="/register">
                    무료로 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/courses">강의 둘러보기</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        {/* Exam Types */}
        <section className="border-y bg-muted/30 py-12">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {examTypes.map((exam) => (
                <Link
                  key={exam.name}
                  href={`/questions?examType=${exam.name}`}
                  className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium hover:border-primary transition-colors"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${exam.color}`}
                  ></span>
                  {exam.name}
                  <span className="text-muted-foreground">{exam.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                합격을 위한 모든 것
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                ExamForge는 AI 기술을 활용해 효율적인 학습 경험을 제공합니다
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-muted/30 py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                학습 여정 시작하기
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                3단계로 시작하는 스마트한 시험 준비
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">목표 설정</h3>
                <p className="mt-2 text-muted-foreground">
                  시험 유형과 목표 점수를 설정하면 AI가 맞춤형 학습 계획을 수립합니다
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">문제 풀이</h3>
                <p className="mt-2 text-muted-foreground">
                  AI 추천 문제를 풀며 실력을 쌓고, 실시간 분석으로 취약점을 파악합니다
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">합격 달성</h3>
                <p className="mt-2 text-muted-foreground">
                  모의고사로 실전 감각을 키우고, 합격보장반으로 확실한 합격을 노립니다
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                합격자들의 이야기
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                ExamForge와 함께 목표를 이룬 분들의 후기입니다
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-muted/30 py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                합리적인 가격
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                무료로 시작하고, 필요에 따라 업그레이드하세요
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${plan.popular ? "border-primary border-2" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>가장 인기</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        {plan.price === "0" ? "무료" : `₩${plan.price}`}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-6 w-full"
                      variant={plan.popular ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/register">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                지금 바로 시작하세요
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                10만개 이상의 무료 문제와 AI 맞춤 학습으로 합격의 꿈을 이루세요
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" asChild>
                  <Link href="/register">
                    무료로 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/questions">문제 미리보기</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
