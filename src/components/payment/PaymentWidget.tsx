"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadTossPayments, TossPayments } from "@tosspayments/tosspayments-sdk";

interface PaymentWidgetProps {
  orderId: string;
  orderName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess?: (paymentKey: string) => void;
  onFail?: (error: Error) => void;
}

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

export function PaymentWidget({
  orderId,
  orderName,
  amount,
  customerName,
  customerEmail,
  onSuccess,
  onFail,
}: PaymentWidgetProps) {
  const [tossPayments, setTossPayments] = useState<TossPayments | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<string>("CARD");
  const paymentWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initTossPayments() {
      try {
        const toss = await loadTossPayments(TOSS_CLIENT_KEY);
        setTossPayments(toss);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load Toss Payments:", error);
        setIsLoading(false);
      }
    }

    initTossPayments();
  }, []);

  const handlePayment = async () => {
    if (!tossPayments) {
      console.error("Toss Payments not loaded");
      return;
    }

    try {
      // Request payment
      const payment = tossPayments.payment({ customerKey: customerEmail });

      await payment.requestPayment({
        method: selectedMethod as "CARD" | "TRANSFER" | "VIRTUAL_ACCOUNT" | "MOBILE_PHONE",
        amount: {
          value: amount,
          currency: "KRW",
        },
        orderId,
        orderName,
        customerName,
        customerEmail,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      });
    } catch (error) {
      console.error("Payment error:", error);
      onFail?.(error as Error);
    }
  };

  const paymentMethods = [
    { id: "CARD", label: "카드", icon: "💳" },
    { id: "TRANSFER", label: "계좌이체", icon: "🏦" },
    { id: "VIRTUAL_ACCOUNT", label: "가상계좌", icon: "📋" },
    { id: "MOBILE_PHONE", label: "휴대폰", icon: "📱" },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">결제 모듈을 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">결제 수단 선택</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment methods */}
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMethod === method.id
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-muted-foreground/50"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <span className="text-2xl block mb-1">{method.icon}</span>
              <span className="text-sm font-medium">{method.label}</span>
            </button>
          ))}
        </div>

        {/* Order summary */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">상품명</span>
            <span>{orderName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">주문번호</span>
            <span className="font-mono text-xs">{orderId}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>결제 금액</span>
              <span className="text-primary">{amount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* Pay button */}
        <Button className="w-full" size="lg" onClick={handlePayment}>
          {amount.toLocaleString()}원 결제하기
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          결제 진행 시 토스페이먼츠의 결제 약관에 동의하는 것으로 간주됩니다.
        </p>
      </CardContent>
    </Card>
  );
}
