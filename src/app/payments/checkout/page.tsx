"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { PaymentWidget } from "@/components/payment";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const orderId = searchParams.get("orderId") || "";
  const tier = searchParams.get("tier") || "";
  const amount = parseInt(searchParams.get("amount") || "0", 10);

  const tierNames: Record<string, string> = {
    basic: "베이직 멤버십",
    premium: "프리미엄 멤버십",
    vip: "VIP 멤버십",
  };

  if (!orderId || !amount) {
    return (
      <div className="container py-16 max-w-lg">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">잘못된 접근입니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">결제하기</h1>

      <PaymentWidget
        orderId={orderId}
        orderName={tierNames[tier] || "ExamForge 서비스"}
        amount={amount}
        customerName={session?.user?.name || "고객"}
        customerEmail={session?.user?.email || ""}
      />
    </div>
  );
}

export default function CheckoutPage() {
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
      <CheckoutContent />
    </Suspense>
  );
}
