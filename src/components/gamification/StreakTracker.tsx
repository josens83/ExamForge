"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { STREAK_REWARDS } from "@/types";

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  lastCheckinAt?: Date;
  streakFreezes: number;
  hasCheckedInToday: boolean;
  onCheckin?: () => void;
  onUseFreeze?: () => void;
}

export function StreakTracker({
  currentStreak,
  longestStreak,
  lastCheckinAt,
  streakFreezes,
  hasCheckedInToday,
  onCheckin,
  onUseFreeze,
}: StreakTrackerProps) {
  const [showFreezeConfirm, setShowFreezeConfirm] = useState(false);

  // Calculate next milestone
  const milestones = Object.keys(STREAK_REWARDS).map(Number).sort((a, b) => a - b);
  const nextMilestone = milestones.find((m) => m > currentStreak) || milestones[milestones.length - 1];
  const prevMilestone = milestones.filter((m) => m <= currentStreak).pop() || 0;
  const progressToNext = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  // Get reward for next milestone
  const nextReward = STREAK_REWARDS[nextMilestone];

  // Check if streak is at risk (hasn't checked in today and it's past noon)
  const now = new Date();
  const isAtRisk = !hasCheckedInToday && now.getHours() >= 12;

  // Get streak flame color based on streak length
  const getFlameColor = () => {
    if (currentStreak >= 100) return "text-purple-500";
    if (currentStreak >= 30) return "text-orange-500";
    if (currentStreak >= 7) return "text-yellow-500";
    return "text-red-500";
  };

  // Render week view
  const renderWeekView = () => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const today = now.getDay();
    const mondayOffset = today === 0 ? -6 : 1 - today;

    return (
      <div className="flex justify-between mt-4">
        {days.map((day, index) => {
          const dayOffset = mondayOffset + index;
          const isToday = dayOffset === 0;
          const isPast = dayOffset < 0;
          const isCompleted = isPast || (isToday && hasCheckedInToday);

          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{day}</span>
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                  isCompleted && "bg-primary text-primary-foreground",
                  isToday && !hasCheckedInToday && "border-2 border-primary bg-primary/10",
                  !isCompleted && !isToday && "bg-muted"
                )}
              >
                {isCompleted ? "✓" : isToday ? "!" : ""}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={cn(isAtRisk && "border-red-500 border-2")}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className={cn("text-2xl", getFlameColor())}>🔥</span>
            연속 학습
          </CardTitle>
          {streakFreezes > 0 && (
            <div className="flex items-center gap-1 text-sm text-blue-500">
              <span>❄️</span>
              <span>{streakFreezes}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className={cn("text-4xl font-bold", getFlameColor())}>
              {currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">현재 연속</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-muted-foreground">
              {longestStreak}
            </div>
            <div className="text-sm text-muted-foreground">최장 기록</div>
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>다음 보상: {nextReward?.badge}</span>
            <span>{currentStreak}/{nextMilestone}일</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
          <div className="flex gap-2 text-xs text-muted-foreground">
            {nextReward?.coins && <span>💰 {nextReward.coins}</span>}
            {nextReward?.streakFreeze && <span>❄️ {nextReward.streakFreeze}</span>}
            {nextReward?.premiumDays && <span>⭐ {nextReward.premiumDays}일</span>}
          </div>
        </div>

        {/* Week view */}
        {renderWeekView()}

        {/* Action buttons */}
        <div className="mt-4 space-y-2">
          {!hasCheckedInToday && (
            <Button
              onClick={onCheckin}
              className="w-full"
              variant={isAtRisk ? "destructive" : "default"}
            >
              {isAtRisk ? "⚠️ 오늘 학습하기 (연속 유지)" : "오늘 학습 시작하기"}
            </Button>
          )}

          {isAtRisk && streakFreezes > 0 && !showFreezeConfirm && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFreezeConfirm(true)}
            >
              ❄️ 스트릭 보호권 사용
            </Button>
          )}

          {showFreezeConfirm && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
              <p className="text-sm">스트릭 보호권을 사용하시겠습니까?</p>
              <p className="text-xs text-muted-foreground">
                하루 동안 연속 학습이 끊기지 않습니다.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onUseFreeze?.();
                    setShowFreezeConfirm(false);
                  }}
                >
                  사용하기
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFreezeConfirm(false)}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>

        {hasCheckedInToday && (
          <div className="mt-4 text-center text-sm text-green-600 dark:text-green-400">
            ✓ 오늘 학습 완료! 내일도 힘내세요 💪
          </div>
        )}
      </CardContent>
    </Card>
  );
}
