import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Target,
  Users,
  Award,
  BookOpen,
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "누적 회원 수", value: "50,000+", icon: Users },
  { label: "합격자 수", value: "3,200+", icon: Award },
  { label: "문제 수", value: "100,000+", icon: BookOpen },
  { label: "강의 수", value: "500+", icon: GraduationCap },
];

const values = [
  {
    title: "효율적인 학습",
    description:
      "AI 기반 맞춤형 학습 경로와 취약점 분석으로 학습 시간을 최적화합니다.",
    icon: Brain,
  },
  {
    title: "최신 트렌드 반영",
    description:
      "매년 변화하는 출제 경향을 분석하여 가장 효과적인 학습 자료를 제공합니다.",
    icon: Sparkles,
  },
  {
    title: "검증된 합격 전략",
    description:
      "3,200명 이상의 합격자들이 검증한 학습 방법론을 적용합니다.",
    icon: Target,
  },
];

const team = [
  {
    name: "김대표",
    role: "CEO / Founder",
    bio: "전 공무원 시험 수석 합격자. 10년간의 강의 경험을 바탕으로 ExamForge를 설립.",
    avatar: "KD",
  },
  {
    name: "이개발",
    role: "CTO",
    bio: "카이스트 컴퓨터공학 박사. AI 기반 교육 시스템 전문가.",
    avatar: "LD",
  },
  {
    name: "박컨텐츠",
    role: "콘텐츠 총괄",
    bio: "전 대형 학원 컨텐츠 디렉터. 15년간 수험 교재 개발 경력.",
    avatar: "PC",
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">ExamForge 소개</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI 기술과 검증된 학습 방법론을 결합하여
          <br />
          수험생의 합격을 돕는 차세대 교육 플랫폼입니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">우리의 미션</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-6">
            ExamForge는 &quot;모든 수험생에게 공정한 기회를&quot;이라는 미션 아래
            설립되었습니다. 지역, 경제적 여건에 관계없이 누구나 양질의 교육을
            받을 수 있도록 기술을 활용한 혁신적인 학습 환경을 제공합니다.
          </p>
          <p className="text-lg text-muted-foreground">
            단순히 문제를 풀고 강의를 듣는 것을 넘어, AI 튜터, 게이미피케이션,
            소셜 학습 등 다양한 기능을 통해 학습의 효율성과 지속성을 높이고
            있습니다.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">핵심 가치</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title}>
              <CardContent className="pt-6">
                <value.icon className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">팀 소개</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name}>
              <CardContent className="pt-6 text-center">
                <div className="h-20 w-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {member.avatar}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">연혁</h2>
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            {[
              { year: "2024", event: "AI 튜터 2.0 출시, 50,000 회원 달성" },
              { year: "2023", event: "시리즈 A 투자 유치, 모바일 앱 출시" },
              { year: "2022", event: "정식 서비스 출시, 1,000명 합격자 배출" },
              { year: "2021", event: "베타 서비스 시작" },
              { year: "2020", event: "ExamForge 설립" },
            ].map((item, index) => (
              <div key={item.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {index < 4 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="font-bold text-lg">{item.year}</div>
                  <div className="text-muted-foreground">{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-muted/50 rounded-2xl p-12">
        <h2 className="text-2xl font-bold mb-4">
          지금 바로 합격의 첫 걸음을 시작하세요
        </h2>
        <p className="text-muted-foreground mb-6">
          무료로 시작하고, 나에게 맞는 학습 방법을 찾아보세요.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">무료로 시작하기</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">문의하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
