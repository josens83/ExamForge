"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Achievement, AchievementCategory, BadgeColor, UserAchievement, ACHIEVEMENTS } from "@/types";

interface AchievementBadgesProps {
  unlockedAchievements: UserAchievement[];
  inProgressAchievements?: {
    achievementCode: string;
    progress: number;
  }[];
}

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  streak: "연속 학습",
  accuracy: "정확도",
  quantity: "학습량",
  speed: "속도",
  special: "특별",
};

const BADGE_COLORS: Record<BadgeColor, { bg: string; border: string; text: string }> = {
  bronze: { bg: "bg-amber-100", border: "border-amber-500", text: "text-amber-700" },
  silver: { bg: "bg-slate-100", border: "border-slate-400", text: "text-slate-700" },
  gold: { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-700" },
  platinum: { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-700" },
};

export function AchievementBadges({
  unlockedAchievements,
  inProgressAchievements = [],
}: AchievementBadgesProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [activeTab, setActiveTab] = useState<AchievementCategory | "all">("all");

  const unlockedCodes = new Set(unlockedAchievements.map((ua) => ua.achievement.code));

  // Get progress for an achievement
  const getProgress = (code: string) => {
    const inProgress = inProgressAchievements.find((p) => p.achievementCode === code);
    return inProgress?.progress || 0;
  };

  // Filter achievements by category
  const filterAchievements = (category: AchievementCategory | "all") => {
    if (category === "all") return ACHIEVEMENTS;
    return ACHIEVEMENTS.filter((a) => a.category === category);
  };

  // Render a single achievement badge
  const renderBadge = (achievement: Omit<Achievement, "id">) => {
    const isUnlocked = unlockedCodes.has(achievement.code);
    const progress = getProgress(achievement.code);
    const colors = BADGE_COLORS[achievement.badgeColor];

    return (
      <div
        key={achievement.code}
        className={cn(
          "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105",
          isUnlocked
            ? cn(colors.bg, colors.border)
            : "bg-muted/50 border-muted grayscale",
          achievement.isSecret && !isUnlocked && "opacity-50"
        )}
        onClick={() => setSelectedAchievement(achievement as Achievement)}
      >
        <div className="text-center">
          <div className={cn(
            "text-3xl mb-2",
            !isUnlocked && "filter blur-sm"
          )}>
            {achievement.isSecret && !isUnlocked ? "❓" : achievement.icon}
          </div>
          <div className={cn(
            "text-sm font-medium truncate",
            isUnlocked ? colors.text : "text-muted-foreground"
          )}>
            {achievement.isSecret && !isUnlocked ? "???" : achievement.name}
          </div>
          {!isUnlocked && progress > 0 && (
            <div className="mt-2">
              <Progress value={progress} className="h-1" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          )}
          {isUnlocked && (
            <Badge variant="secondary" className="mt-2 text-xs">
              획득완료
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">업적</CardTitle>
            <Badge variant="outline">
              {unlockedAchievements.length}/{ACHIEVEMENTS.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AchievementCategory | "all")}>
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                전체
              </TabsTrigger>
              {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {CATEGORY_LABELS[category]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {filterAchievements(activeTab).map(renderBadge)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Achievement Detail Dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        {selectedAchievement && (
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedAchievement.icon}</span>
                <div>
                  <DialogTitle>{selectedAchievement.name}</DialogTitle>
                  <DialogDescription>
                    {selectedAchievement.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">보상 XP</span>
                <span className="font-semibold">{selectedAchievement.xpReward} XP</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">카테고리</span>
                <Badge>{CATEGORY_LABELS[selectedAchievement.category]}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm">등급</span>
                <Badge
                  className={cn(
                    BADGE_COLORS[selectedAchievement.badgeColor].bg,
                    BADGE_COLORS[selectedAchievement.badgeColor].text
                  )}
                >
                  {selectedAchievement.badgeColor.toUpperCase()}
                </Badge>
              </div>
              {unlockedCodes.has(selectedAchievement.code) ? (
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    ✓ 획득 완료!
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>진행률</span>
                    <span>{getProgress(selectedAchievement.code)}%</span>
                  </div>
                  <Progress value={getProgress(selectedAchievement.code)} />
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
