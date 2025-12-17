"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MEMBERSHIP_BENEFITS, MembershipTier } from "@/types";

const MEMBERSHIP_TIERS: {
  id: MembershipTier;
  name: string;
  description: string;
  price: number;
  popular?: boolean;
}[] = [
  {
    id: "free",
    name: "무료",
    description: "기본 기능으로 시작하기",
    price: 0,
  },
  {
    id: "basic",
    name: "베이직",
    description: "본격적인 학습을 위한 플랜",
    price: 9900,
  },
  {
    id: "premium",
    name: "프리미엄",
    description: "합격을 위한 최적의 선택",
    price: 29900,
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    description: "프리미엄 멘토링까지",
    price: 99900,
  },
];

const FEATURES = [
  { key: "dailyQuestions", label: "일일 문제 풀이" },
  { key: "mockExamsPerMonth", label: "월간 모의고사" },
  { key: "aiEssayGrading", label: "AI 논술 첨삭" },
  { key: "courseDiscount", label: "강의 할인" },
  { key: "offlineSupport", label: "오프라인 학습" },
  { key: "prioritySupport", label: "우선 지원" },
  { key: "mentoringMinutes", label: "1:1 멘토링" },
];

export default function MembershipPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleSubscribe = async (tier: MembershipTier) => {
    if (tier === "free") return;

    try {
      const benefits = MEMBERSHIP_BENEFITS[tier];
      const price = billingPeriod === "yearly"
        ? Math.round((benefits.price || 0) * 10) // 2 months free
        : benefits.price || 0;

      const response = await fetch("/api/payments/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "membership",
          itemId: tier,
          amount: price,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment page with order details
        router.push(`/payments/checkout?orderId=${data.orderId}&tier=${tier}&amount=${price}`);
      }
    } catch (error) {
      console.error("Failed to prepare payment:", error);
    }
  };

  const formatValue = (key: string, value: number | boolean | undefined) => {
    if (typeof value === "boolean") {
      return value ? "O" : "X";
    }
    if (value === Infinity) {
      return "무제한";
    }
    if (key === "courseDiscount") {
      return value ? `${(value as number) * 100}%` : "-";
    }
    if (key === "mentoringMinutes") {
      return value ? `${value}분/월` : "-";
    }
    return value?.toString() || "-";
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">멤버십 플랜</h1>
        <p className="text-muted-foreground mb-6">
          나에게 맞는 플랜을 선택하고 합격을 향해 달려가세요
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
          <button
            className={cn(
              "px-4 py-2 rounded-md transition-all",
              billingPeriod === "monthly" && "bg-background shadow"
            )}
            onClick={() => setBillingPeriod("monthly")}
          >
            월간 결제
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-md transition-all",
              billingPeriod === "yearly" && "bg-background shadow"
            )}
            onClick={() => setBillingPeriod("yearly")}
          >
            연간 결제
            <Badge className="ml-2 bg-green-500">2개월 무료</Badge>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {MEMBERSHIP_TIERS.map((tier) => {
          const benefits = MEMBERSHIP_BENEFITS[tier.id];
          const displayPrice = billingPeriod === "yearly" && tier.price > 0
            ? Math.round(tier.price * 10)
            : tier.price;
          const monthlyPrice = billingPeriod === "yearly" && tier.price > 0
            ? Math.round(tier.price * 10 / 12)
            : tier.price;

          return (
            <Card
              key={tier.id}
              className={cn(
                "relative",
                tier.popular && "border-primary shadow-lg"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">인기</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {tier.price === 0 ? (
                    <div className="text-3xl font-bold">무료</div>
                  ) : (
                    <>
                      <div className="text-3xl font-bold">
                        {monthlyPrice.toLocaleString()}원
                        <span className="text-sm font-normal text-muted-foreground">
                          /월
                        </span>
                      </div>
                      {billingPeriod === "yearly" && (
                        <div className="text-sm text-muted-foreground">
                          연 {displayPrice.toLocaleString()}원
                        </div>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {FEATURES.map((feature) => {
                    const value = benefits[feature.key as keyof typeof benefits];
                    const isAvailable = value && value !== 0;

                    return (
                      <li
                        key={feature.key}
                        className={cn(
                          "flex items-center gap-2 text-sm",
                          !isAvailable && "text-muted-foreground"
                        )}
                      >
                        <span>{isAvailable ? "✓" : "·"}</span>
                        <span>{feature.label}</span>
                        <span className="ml-auto font-medium">
                          {formatValue(feature.key, value as number | boolean)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={tier.id === "free"}
                >
                  {tier.id === "free" ? "현재 플랜" : "시작하기"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">자주 묻는 질문</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">언제든지 해지할 수 있나요?</h4>
            <p className="text-sm text-muted-foreground">
              네, 언제든지 해지 가능합니다. 해지 시 결제 기간 종료까지 서비스를 이용하실 수 있습니다.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">플랜 변경은 어떻게 하나요?</h4>
            <p className="text-sm text-muted-foreground">
              상위 플랜으로 업그레이드 시 차액만 결제됩니다. 다운그레이드는 현재 결제 기간 종료 후 적용됩니다.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">환불 정책은 어떻게 되나요?</h4>
            <p className="text-sm text-muted-foreground">
              결제 후 7일 이내 미사용 시 전액 환불이 가능합니다. 자세한 내용은 환불 정책을 확인해주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
