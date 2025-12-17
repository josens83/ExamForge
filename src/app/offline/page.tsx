"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-md w-full">
        <CardContent className="py-12 text-center">
          <span className="text-6xl block mb-4">📡</span>
          <h1 className="text-2xl font-bold mb-2">오프라인 상태</h1>
          <p className="text-muted-foreground mb-6">
            인터넷 연결이 끊어졌습니다.<br />
            연결을 확인하고 다시 시도해주세요.
          </p>
          <Button onClick={handleRetry} className="w-full">
            다시 시도
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            오프라인 모드에서도 이전에 저장된 문제를 복습할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
