"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileQuestion,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual API calls
const stats = [
  {
    title: "총 사용자",
    value: "12,345",
    change: "+12%",
    trend: "up",
    icon: Users,
  },
  {
    title: "총 강좌",
    value: "156",
    change: "+3",
    trend: "up",
    icon: BookOpen,
  },
  {
    title: "총 문제 수",
    value: "8,432",
    change: "+234",
    trend: "up",
    icon: FileQuestion,
  },
  {
    title: "이번 달 매출",
    value: "₩45,230,000",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
  },
];

const recentUsers = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    plan: "PREMIUM",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    plan: "BASIC",
    joinedAt: "2024-01-14",
  },
  {
    id: "3",
    name: "박민수",
    email: "park@example.com",
    plan: "FREE",
    joinedAt: "2024-01-14",
  },
  {
    id: "4",
    name: "최수진",
    email: "choi@example.com",
    plan: "PREMIUM",
    joinedAt: "2024-01-13",
  },
  {
    id: "5",
    name: "정우성",
    email: "jung@example.com",
    plan: "BASIC",
    joinedAt: "2024-01-13",
  },
];

const recentPayments = [
  {
    id: "PAY-001",
    user: "김철수",
    amount: 99000,
    plan: "PREMIUM",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "PAY-002",
    user: "이영희",
    amount: 29000,
    plan: "BASIC",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "PAY-003",
    user: "최수진",
    amount: 99000,
    plan: "PREMIUM",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "PAY-004",
    user: "정우성",
    amount: 29000,
    plan: "BASIC",
    status: "completed",
    date: "2024-01-13",
  },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 animate-pulse bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          ExamForge 관리자 대시보드입니다.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-muted-foreground">
                  지난 달 대비
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              최근 가입자
            </CardTitle>
            <CardDescription>최근 가입한 사용자 목록</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>플랜</TableHead>
                  <TableHead>가입일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.plan === "PREMIUM"
                            ? "default"
                            : user.plan === "BASIC"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.joinedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              최근 결제
            </CardTitle>
            <CardDescription>최근 결제 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">
                      {payment.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.user}
                    </TableCell>
                    <TableCell>
                      ₩{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {payment.status === "completed" ? "완료" : "대기"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            실시간 활동
          </CardTitle>
          <CardDescription>플랫폼 내 실시간 활동 피드</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "김철수님이 '행정법 기출문제' 강좌를 구매했습니다.", time: "2분 전" },
              { action: "이영희님이 문제 #1234를 풀었습니다.", time: "5분 전" },
              { action: "박민수님이 새로 가입했습니다.", time: "10분 전" },
              { action: "최수진님이 '9급 공무원 헌법' 강좌를 완료했습니다.", time: "15분 전" },
              { action: "정우성님이 리뷰를 작성했습니다.", time: "20분 전" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <p className="text-sm">{activity.action}</p>
                <span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
