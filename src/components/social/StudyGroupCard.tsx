"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { StudyGroup, ExamType } from "@/types";

interface StudyGroupCardProps {
  group: StudyGroup & {
    members?: { id: string; userName: string; userImage?: string }[];
    isJoined?: boolean;
    activityScore?: number;
  };
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onView?: (groupId: string) => void;
}

const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  gosi_9: "9급 공무원",
  gosi_7: "7급 공무원",
  gosi_5: "5급 공무원",
  police: "경찰공무원",
  fire: "소방공무원",
  teacher: "교원임용",
  cpa: "공인회계사",
  lawyer: "변호사",
  patent: "변리사",
  toeic: "토익",
  toefl: "토플",
  ielts: "아이엘츠",
  sqld: "SQLD",
  aip: "정보처리기사",
  engineer: "기술사",
};

export function StudyGroupCard({
  group,
  onJoin,
  onLeave,
  onView,
}: StudyGroupCardProps) {
  const occupancy = (group.memberCount / group.maxMembers) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {EXAM_TYPE_LABELS[group.examType] || group.examType}
            </Badge>
          </div>
          {group.activityScore && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">활동점수</div>
              <div className="font-semibold text-primary">{group.activityScore}</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {group.description}
          </p>
        )}

        {/* Members preview */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {group.members?.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                <AvatarImage src={member.userImage} />
                <AvatarFallback>{member.userName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            ))}
            {(group.memberCount || 0) > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                +{group.memberCount - 5}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {group.memberCount}/{group.maxMembers}명
          </span>
        </div>

        {/* Occupancy bar */}
        <div className="mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                occupancy >= 90 ? "bg-red-500" : occupancy >= 70 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {group.isJoined ? (
            <>
              <Button className="flex-1" onClick={() => onView?.(group.id)}>
                그룹 입장
              </Button>
              <Button variant="outline" onClick={() => onLeave?.(group.id)}>
                탈퇴
              </Button>
            </>
          ) : (
            <Button
              className="flex-1"
              disabled={group.memberCount >= group.maxMembers}
              onClick={() => onJoin?.(group.id)}
            >
              {group.memberCount >= group.maxMembers ? "정원 초과" : "가입하기"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
