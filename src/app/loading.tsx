import { GraduationCap } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary animate-pulse">
          <GraduationCap className="h-7 w-7 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold">ExamForge</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">로딩 중...</p>
    </div>
  );
}
