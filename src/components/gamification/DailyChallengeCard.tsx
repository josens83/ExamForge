"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DailyChallenge } from "@/types";

interface DailyChallengeCardProps {
  challenges: DailyChallenge[];
  onStartChallenge?: (challengeId: string) => void;
}

const CHALLENGE_TYPE_ICONS: Record<DailyChallenge["type"], string> = {
  questions: "📝",
  time: "⏱️",
  streak: "🔥",
  accuracy: "🎯",
};

const BONUS_REWARD_LABELS: Record<string, string> = {
  streak_freeze: "스트릭 보호권",
  double_xp: "2배 XP",
  premium_day: "프리미엄 체험",
};

export function DailyChallengeCard({
  challenges,
  onStartChallenge,
}: DailyChallengeCardProps) {
  // Get time remaining until midnight
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const hoursRemaining = Math.floor((midnight.getTime() - now.getTime()) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor(((midnight.getTime() - now.getTime()) % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            오늘의 챌린지
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {hoursRemaining}시간 {minutesRemaining}분 남음
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                challenge.completed
                  ? "bg-green-50 dark:bg-green-950/30 border-green-500"
                  : "bg-muted/30 hover:bg-muted/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {CHALLENGE_TYPE_ICONS[challenge.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{challenge.title}</h4>
                    {challenge.completed && (
                      <Badge className="bg-green-500">완료!</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {challenge.description}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs">
                      <span>진행률</span>
                      <span>
                        {Math.round((challenge.progress || 0))}%
                      </span>
                    </div>
                    <Progress
                      value={challenge.progress || 0}
                      className={cn(
                        "h-2",
                        challenge.completed && "[&>div]:bg-green-500"
                      )}
                    />
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span>⚡</span>
                      <span>{challenge.xpReward} XP</span>
                    </div>
                    {challenge.bonusReward && (
                      <div className="flex items-center gap-1 text-primary">
                        <span>🎁</span>
                        <span>
                          {BONUS_REWARD_LABELS[challenge.bonusReward.type] || challenge.bonusReward.type}
                          {challenge.bonusReward.count > 1 && ` x${challenge.bonusReward.count}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Start button */}
                  {!challenge.completed && (
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => onStartChallenge?.(challenge.id)}
                    >
                      도전하기
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {challenges.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-4xl block mb-2">🎉</span>
              오늘의 모든 챌린지를 완료했습니다!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
