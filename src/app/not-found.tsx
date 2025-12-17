import Link from "next/link";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>페이지를 찾을 수 없습니다</CardTitle>
          <CardDescription>
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button className="w-full" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                홈으로 이동
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/questions">
                <Search className="mr-2 h-4 w-4" />
                문제 검색하기
              </Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                이전 페이지로
              </Link>
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>도움이 필요하시면</p>
            <Link href="/contact" className="text-primary hover:underline">
              고객센터
            </Link>
            로 문의해 주세요.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
