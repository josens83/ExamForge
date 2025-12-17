"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorCode = searchParams.get("code") || "";
  const errorMessage = searchParams.get("message") || "결제가 취소되었거나 실패했습니다.";

  return (
    <div className="container py-16 max-w-lg">
      <Card>
        <CardContent className="py-12 text-center">
          <span className="text-6xl block mb-4">😥</span>
          <h2 className="text-2xl font-bold mb-2">결제 실패</h2>
          <p className="text-muted-foreground mb-2">{errorMessage}</p>
          {errorCode && (
            <p className="text-xs text-muted-foreground mb-6">
              오류 코드: {errorCode}
            </p>
          )}
          <div className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/membership")}>
              다시 시도하기
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              홈으로 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="container py-16 max-w-lg">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">로딩 중...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
