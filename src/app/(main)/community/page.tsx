"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudyGroupCard } from "@/components/social";
import { StudyGroup, Discussion, ExamType } from "@/types";

// Mock data
const mockStudyGroups: (StudyGroup & { isJoined?: boolean; members?: { id: string; userName: string; userImage?: string }[]; activityScore?: number })[] = [
  {
    id: "sg-1",
    name: "9급 공무원 합격반",
    description: "함께 공부하고 합격을 목표로 하는 스터디 그룹입니다. 매일 인증과 질문을 공유해요!",
    examType: "gosi_9",
    isPublic: true,
    maxMembers: 50,
    memberCount: 47,
    creatorId: "user-1",
    createdAt: new Date(),
    isJoined: true,
    activityScore: 2450,
    members: [
      { id: "1", userName: "김합격", userImage: "" },
      { id: "2", userName: "이성공", userImage: "" },
      { id: "3", userName: "박노력", userImage: "" },
      { id: "4", userName: "최열심", userImage: "" },
      { id: "5", userName: "정끈기", userImage: "" },
    ],
  },
  {
    id: "sg-2",
    name: "행정법 마스터",
    description: "행정법 전문 스터디 그룹입니다. 판례 분석과 문제 풀이를 함께 합니다.",
    examType: "gosi_9",
    isPublic: true,
    maxMembers: 30,
    memberCount: 28,
    creatorId: "user-2",
    createdAt: new Date(),
    activityScore: 1890,
    members: [
      { id: "6", userName: "강법률", userImage: "" },
      { id: "7", userName: "조판례", userImage: "" },
    ],
  },
  {
    id: "sg-3",
    name: "영어 스터디",
    description: "영어 문제풀이와 독해력 향상을 위한 그룹입니다.",
    examType: "gosi_9",
    isPublic: true,
    maxMembers: 40,
    memberCount: 15,
    creatorId: "user-3",
    createdAt: new Date(),
    activityScore: 980,
    members: [
      { id: "8", userName: "윤영어", userImage: "" },
    ],
  },
];

const mockDiscussions: Discussion[] = [
  {
    id: "d-1",
    studyGroupId: "sg-1",
    userId: "user-1",
    userName: "김합격",
    title: "행정행위의 부관 관련 질문입니다",
    content: "부관의 종류 중 조건과 기한의 구별이 헷갈립니다. 조건은 불확실한 사실, 기한은 확실한 사실에 의존한다고 하는데, 구체적인 예시를 알려주실 수 있나요?",
    upvotes: 15,
    downvotes: 0,
    viewCount: 234,
    commentCount: 8,
    isPinned: false,
    isResolved: true,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "d-2",
    studyGroupId: "sg-1",
    userId: "user-2",
    userName: "이성공",
    title: "[정보공유] 2024년 출제 예상 주제 정리",
    content: "각 과목별 출제 예상 주제를 정리해봤습니다. 참고하시고 의견 남겨주세요!",
    upvotes: 45,
    downvotes: 2,
    viewCount: 567,
    commentCount: 23,
    isPinned: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: "d-3",
    userId: "user-3",
    userName: "박노력",
    title: "하루 몇 시간 공부하시나요?",
    content: "다들 하루에 몇 시간씩 공부하시나요? 저는 직장인이라 평일에는 3시간 정도밖에 못하는데, 너무 부족한 것 같아서 걱정입니다.",
    upvotes: 32,
    downvotes: 0,
    viewCount: 421,
    commentCount: 45,
    isPinned: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 7200000),
  },
];

const EXAM_TYPE_OPTIONS: { value: ExamType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "gosi_9", label: "9급 공무원" },
  { value: "gosi_7", label: "7급 공무원" },
  { value: "police", label: "경찰공무원" },
  { value: "cpa", label: "공인회계사" },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExamType, setSelectedExamType] = useState<ExamType | "all">("all");

  // Filter discussions
  const filteredDiscussions = mockDiscussions.filter((d) => {
    if (searchQuery && !d.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Filter groups
  const filteredGroups = mockStudyGroups.filter((g) => {
    if (selectedExamType !== "all" && g.examType !== selectedExamType) {
      return false;
    }
    if (searchQuery && !g.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
        <p className="text-muted-foreground">
          함께 공부하고 정보를 나누는 학습 커뮤니티
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,234</div>
              <div className="text-sm text-muted-foreground">활성 스터디</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">45,678</div>
              <div className="text-sm text-muted-foreground">전체 회원</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">12,345</div>
              <div className="text-sm text-muted-foreground">오늘 질문</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">98.5%</div>
              <div className="text-sm text-muted-foreground">답변률</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          {EXAM_TYPE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedExamType === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedExamType(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="groups">스터디 그룹</TabsTrigger>
          <TabsTrigger value="discussions">질문/토론</TabsTrigger>
          <TabsTrigger value="my">내 활동</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">스터디 그룹</h2>
            <Button>새 그룹 만들기</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onJoin={(id) => console.log("Join", id)}
                onLeave={(id) => console.log("Leave", id)}
                onView={(id) => console.log("View", id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">질문/토론</h2>
            <Button>새 글 작성</Button>
          </div>
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={discussion.userImage} />
                      <AvatarFallback>{discussion.userName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {discussion.isPinned && (
                          <Badge variant="secondary">📌 고정</Badge>
                        )}
                        {discussion.isResolved && (
                          <Badge className="bg-green-500">✓ 해결됨</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {discussion.userName}
                        </span>
                      </div>
                      <h3 className="font-semibold truncate">{discussion.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {discussion.content}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>👍 {discussion.upvotes}</span>
                        <span>💬 {discussion.commentCount}</span>
                        <span>👁️ {discussion.viewCount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my">
          <div className="grid md:grid-cols-2 gap-6">
            {/* My groups */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">내 스터디 그룹</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockStudyGroups.filter((g) => g.isJoined).map((group) => (
                    <div key={group.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {group.memberCount}명
                        </div>
                      </div>
                      <Button variant="outline" size="sm">입장</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">내 활동 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">작성한 글</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm text-muted-foreground">작성한 댓글</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">받은 추천</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-sm text-muted-foreground">채택된 답변</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
