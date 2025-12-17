"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function confirmPayment() {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount, 10),
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("결제가 완료되었습니다!");
        } else {
          setStatus("error");
          setMessage(data.error || "결제 확인에 실패했습니다.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("결제 처리 중 오류가 발생했습니다.");
      }
    }

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="container py-16 max-w-lg">
      <Card>
        <CardContent className="py-12 text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">결제 확인 중...</h2>
              <p className="text-muted-foreground">잠시만 기다려주세요.</p>
            </>
          )}

          {status === "success" && (
            <>
              <span className="text-6xl block mb-4">🎉</span>
              <h2 className="text-2xl font-bold mb-2">결제 완료!</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  대시보드로 이동
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/questions")}>
                  학습 시작하기
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <span className="text-6xl block mb-4">😥</span>
              <h2 className="text-2xl font-bold mb-2">결제 실패</h2>
              <p className="text-muted-foreground mb-6">{message}</p>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => router.push("/membership")}>
                  다시 시도하기
                </Button>
                <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                  홈으로 이동
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 max-w-lg">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">로딩 중...</h2>
          </CardContent>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
