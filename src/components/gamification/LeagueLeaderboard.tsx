"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LEAGUES, LeagueTier, LeagueMember } from "@/types";

interface LeagueLeaderboardProps {
  currentLeague: LeagueTier;
  members: LeagueMember[];
  currentUserId: string;
  weeklyXP: number;
  daysUntilReset: number;
  promotionZone: number; // Number of people who get promoted
  demotionZone: number; // Number of people who get demoted
}

export function LeagueLeaderboard({
  currentLeague,
  members,
  currentUserId,
  weeklyXP,
  daysUntilReset,
  promotionZone = 3,
  demotionZone = 5,
}: LeagueLeaderboardProps) {
  const league = LEAGUES[currentLeague];
  const sortedMembers = [...members].sort((a, b) => b.weeklyXP - a.weeklyXP);
  const currentUserRank = sortedMembers.findIndex((m) => m.userId === currentUserId) + 1;
  const totalMembers = sortedMembers.length;

  // Get zone for a rank
  const getZone = (rank: number): "promotion" | "safe" | "demotion" => {
    if (rank <= promotionZone && currentLeague !== "champion") return "promotion";
    if (rank > totalMembers - demotionZone && currentLeague !== "bronze") return "demotion";
    return "safe";
  };

  // Get rank badge
  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  // Calculate XP needed for promotion
  const getXPForPromotion = () => {
    if (currentUserRank <= promotionZone) return 0;
    const promotionThresholdMember = sortedMembers[promotionZone - 1];
    return Math.max(0, promotionThresholdMember.weeklyXP - weeklyXP + 1);
  };

  // Calculate XP buffer before demotion
  const getXPBufferFromDemotion = () => {
    if (currentUserRank <= totalMembers - demotionZone) return null;
    const safeThresholdMember = sortedMembers[totalMembers - demotionZone - 1];
    return Math.max(0, safeThresholdMember.weeklyXP - weeklyXP);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">{league.icon}</span>
            <span style={{ color: league.color }}>{league.name} 리그</span>
          </CardTitle>
          <Badge variant="outline">
            리셋까지 {daysUntilReset}일
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          매주 일요일 자정에 리셋됩니다
        </p>
      </CardHeader>
      <CardContent>
        {/* Current user status */}
        <div className="mb-4 p-3 rounded-lg bg-primary/5 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">내 순위</span>
            <span className="text-2xl font-bold">{getRankBadge(currentUserRank)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>주간 XP</span>
            <span className="font-semibold">{weeklyXP.toLocaleString()} XP</span>
          </div>
          {currentLeague !== "champion" && getXPForPromotion() > 0 && (
            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
              승급까지 {getXPForPromotion().toLocaleString()} XP 필요
            </div>
          )}
          {getXPBufferFromDemotion() !== null && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
              강등까지 {getXPBufferFromDemotion()?.toLocaleString()} XP 차이
            </div>
          )}
        </div>

        {/* Zone legend */}
        <div className="flex gap-4 mb-3 text-xs">
          {currentLeague !== "champion" && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>승급권</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-muted" />
            <span>유지</span>
          </div>
          {currentLeague !== "bronze" && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>강등권</span>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {sortedMembers.map((member, index) => {
            const rank = index + 1;
            const zone = getZone(rank);
            const isCurrentUser = member.userId === currentUserId;

            return (
              <div
                key={member.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg transition-colors",
                  zone === "promotion" && "bg-green-50 dark:bg-green-950/30",
                  zone === "demotion" && "bg-red-50 dark:bg-red-950/30",
                  zone === "safe" && "bg-muted/30",
                  isCurrentUser && "ring-2 ring-primary"
                )}
              >
                <div className="w-8 text-center font-semibold">
                  {getRankBadge(rank)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.userImage} />
                  <AvatarFallback>
                    {member.userName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "truncate",
                      isCurrentUser && "font-semibold"
                    )}>
                      {member.userName}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="secondary" className="text-xs">
                        나
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {member.weeklyXP.toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>

        {/* League progression info */}
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">리그 진행</h4>
          <div className="flex justify-between items-center">
            {Object.entries(LEAGUES).map(([tier, leagueInfo]) => (
              <div
                key={tier}
                className={cn(
                  "flex flex-col items-center",
                  tier === currentLeague && "scale-125"
                )}
              >
                <span
                  className={cn(
                    "text-lg",
                    tier === currentLeague ? "opacity-100" : "opacity-40"
                  )}
                >
                  {leagueInfo.icon}
                </span>
                {tier === currentLeague && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
