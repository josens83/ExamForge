"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface XPProgressBarProps {
  currentXP: number;
  level: number;
  todayXP?: number;
  showAnimation?: boolean;
}

// Calculate XP needed for each level (increases exponentially)
const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate total XP needed to reach a level
const getTotalXPForLevel = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i);
  }
  return total;
};

export function XPProgressBar({
  currentXP,
  level,
  todayXP = 0,
  showAnimation = false,
}: XPProgressBarProps) {
  const [animatedXP, setAnimatedXP] = useState(showAnimation ? 0 : currentXP);
  const [showGain, setShowGain] = useState(false);

  const xpForCurrentLevel = getXPForLevel(level);
  const xpInCurrentLevel = currentXP - getTotalXPForLevel(level);
  const progress = (xpInCurrentLevel / xpForCurrentLevel) * 100;

  // Animate XP gain
  useEffect(() => {
    if (showAnimation && animatedXP < currentXP) {
      const increment = Math.max(1, Math.floor((currentXP - animatedXP) / 20));
      const timer = setTimeout(() => {
        setAnimatedXP((prev) => Math.min(prev + increment, currentXP));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [animatedXP, currentXP, showAnimation]);

  // Show XP gain indicator
  useEffect(() => {
    if (todayXP > 0) {
      setShowGain(true);
      const timer = setTimeout(() => setShowGain(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [todayXP]);

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="py-4">
        <div className="flex items-center gap-4">
          {/* Level badge */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">
                {level}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full px-1.5 py-0.5 text-xs font-medium border">
              Lv
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">경험치</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {xpInCurrentLevel.toLocaleString()} / {xpForCurrentLevel.toLocaleString()} XP
                </span>
                {showGain && todayXP > 0 && (
                  <span className="text-sm font-semibold text-green-500 animate-bounce">
                    +{todayXP} XP
                  </span>
                )}
              </div>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3" />
              {/* Level milestones */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                {[25, 50, 75].map((milestone) => (
                  <div
                    key={milestone}
                    className={cn(
                      "absolute w-0.5 h-full",
                      progress >= milestone ? "bg-primary-foreground/30" : "bg-primary/30"
                    )}
                    style={{ left: `${milestone}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                Lv.{level}
              </span>
              <span className="text-xs text-muted-foreground">
                Lv.{level + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Today's stats */}
        {todayXP > 0 && (
          <div className="mt-3 pt-3 border-t flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-muted-foreground">오늘 획득</div>
              <div className="font-semibold text-primary">{todayXP.toLocaleString()} XP</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">총 경험치</div>
              <div className="font-semibold">{currentXP.toLocaleString()} XP</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
