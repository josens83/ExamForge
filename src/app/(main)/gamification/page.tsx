"use client";

import { useState } from "react";
import {
  StreakTracker,
  LeagueLeaderboard,
  AchievementBadges,
  DailyChallengeCard,
  XPProgressBar,
} from "@/components/gamification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyChallenge, LeagueMember, UserAchievement, ACHIEVEMENTS } from "@/types";

// Mock data - replace with real API calls
const mockUserData = {
  id: "user-1",
  level: 15,
  experience: 12500,
  currentStreak: 7,
  longestStreak: 30,
  streakFreezes: 2,
  hasCheckedInToday: true,
  todayXP: 150,
  weeklyXP: 850,
};

const mockLeagueMembers: LeagueMember[] = [
  { id: "1", leagueId: "gold", userId: "user-2", userName: "김합격", weeklyXP: 1250, rank: 1 },
  { id: "2", leagueId: "gold", userId: "user-3", userName: "이성공", weeklyXP: 1100, rank: 2 },
  { id: "3", leagueId: "gold", userId: "user-4", userName: "박노력", weeklyXP: 980, rank: 3 },
  { id: "4", leagueId: "gold", userId: "user-1", userName: "나", weeklyXP: 850, rank: 4, isCurrentUser: true },
  { id: "5", leagueId: "gold", userId: "user-5", userName: "최열심", weeklyXP: 720, rank: 5 },
  { id: "6", leagueId: "gold", userId: "user-6", userName: "정끈기", weeklyXP: 650, rank: 6 },
  { id: "7", leagueId: "gold", userId: "user-7", userName: "강의지", weeklyXP: 580, rank: 7 },
  { id: "8", leagueId: "gold", userId: "user-8", userName: "조시작", weeklyXP: 420, rank: 8 },
  { id: "9", leagueId: "gold", userId: "user-9", userName: "윤초보", weeklyXP: 350, rank: 9 },
  { id: "10", leagueId: "gold", userId: "user-10", userName: "한포기", weeklyXP: 180, rank: 10 },
];

const mockDailyChallenges: DailyChallenge[] = [
  {
    id: "challenge-1",
    date: new Date(),
    title: "50문제 챌린지",
    description: "오늘 50문제를 풀어보세요",
    type: "questions",
    requirement: { count: 50, subject: "all" },
    xpReward: 200,
    bonusReward: { type: "streak_freeze", count: 1 },
    progress: 64,
    completed: false,
  },
  {
    id: "challenge-2",
    date: new Date(),
    title: "정확도 마스터",
    description: "20문제 이상을 90% 정답률로 풀기",
    type: "accuracy",
    requirement: { count: 20, minAccuracy: 90 },
    xpReward: 150,
    progress: 100,
    completed: true,
  },
  {
    id: "challenge-3",
    date: new Date(),
    title: "시간 도전",
    description: "30분 동안 연속 학습하기",
    type: "time",
    requirement: { count: 30 },
    xpReward: 100,
    progress: 45,
    completed: false,
  },
];

const mockUnlockedAchievements: UserAchievement[] = [
  {
    id: "ua-1",
    achievementId: "streak_7",
    achievement: { ...ACHIEVEMENTS.find((a) => a.code === "streak_7")!, id: "streak_7" },
    unlockedAt: new Date(),
    progress: 100,
  },
  {
    id: "ua-2",
    achievementId: "solve_100",
    achievement: { ...ACHIEVEMENTS.find((a) => a.code === "solve_100")!, id: "solve_100" },
    unlockedAt: new Date(),
    progress: 100,
  },
  {
    id: "ua-3",
    achievementId: "first_exam",
    achievement: { ...ACHIEVEMENTS.find((a) => a.code === "first_exam")!, id: "first_exam" },
    unlockedAt: new Date(),
    progress: 100,
  },
];

const mockInProgressAchievements = [
  { achievementCode: "streak_30", progress: 23 },
  { achievementCode: "solve_1000", progress: 45 },
  { achievementCode: "accuracy_80", progress: 78 },
];

export default function GamificationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">나의 학습 여정</h1>
        <p className="text-muted-foreground">
          목표를 달성하고 보상을 획득하세요
        </p>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <XPProgressBar
          currentXP={mockUserData.experience}
          level={mockUserData.level}
          todayXP={mockUserData.todayXP}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="league">리그</TabsTrigger>
          <TabsTrigger value="achievements">업적</TabsTrigger>
          <TabsTrigger value="challenges">챌린지</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <StreakTracker
                currentStreak={mockUserData.currentStreak}
                longestStreak={mockUserData.longestStreak}
                streakFreezes={mockUserData.streakFreezes}
                hasCheckedInToday={mockUserData.hasCheckedInToday}
              />

              {/* Quick stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">오늘의 통계</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">32</div>
                      <div className="text-sm text-muted-foreground">푼 문제</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-500">87%</div>
                      <div className="text-sm text-muted-foreground">정답률</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">45분</div>
                      <div className="text-sm text-muted-foreground">학습 시간</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">+150</div>
                      <div className="text-sm text-muted-foreground">획득 XP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle column */}
            <div className="space-y-6">
              <DailyChallengeCard challenges={mockDailyChallenges.slice(0, 2)} />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <LeagueLeaderboard
                currentLeague="gold"
                members={mockLeagueMembers.slice(0, 5)}
                currentUserId="user-1"
                weeklyXP={mockUserData.weeklyXP}
                daysUntilReset={3}
                promotionZone={3}
                demotionZone={3}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="league">
          <div className="max-w-2xl mx-auto">
            <LeagueLeaderboard
              currentLeague="gold"
              members={mockLeagueMembers}
              currentUserId="user-1"
              weeklyXP={mockUserData.weeklyXP}
              daysUntilReset={3}
              promotionZone={3}
              demotionZone={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementBadges
            unlockedAchievements={mockUnlockedAchievements}
            inProgressAchievements={mockInProgressAchievements}
          />
        </TabsContent>

        <TabsContent value="challenges">
          <div className="max-w-2xl mx-auto">
            <DailyChallengeCard challenges={mockDailyChallenges} />
          </div>
        </TabsContent>
      </Tabs>

      {/* XP Rewards Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">XP 획득 방법</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { action: "정답 맞추기", xp: 10, icon: "✓" },
              { action: "문제 풀기 (오답)", xp: 3, icon: "📝" },
              { action: "일일 목표 달성", xp: 50, icon: "🎯" },
              { action: "모의고사 완료", xp: 100, icon: "📋" },
              { action: "강의 완료", xp: 30, icon: "🎬" },
              { action: "논술 제출", xp: 50, icon: "✍️" },
              { action: "리뷰 작성", xp: 20, icon: "⭐" },
              { action: "연속 학습 보너스", xp: "+5/일", icon: "🔥" },
            ].map((item) => (
              <div
                key={item.action}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="text-sm font-medium">{item.action}</div>
                  <div className="text-xs text-muted-foreground">
                    {typeof item.xp === "number" ? `+${item.xp} XP` : item.xp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
