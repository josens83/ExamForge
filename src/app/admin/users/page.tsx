"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  UserCog,
  Mail,
  Shield,
  Ban,
  Users,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock data
const mockUsers = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    image: null,
    role: "USER",
    plan: "PREMIUM",
    questionsCount: 1234,
    lastActive: "2024-01-15",
    status: "active",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    image: null,
    role: "USER",
    plan: "BASIC",
    questionsCount: 856,
    lastActive: "2024-01-14",
    status: "active",
    createdAt: "2023-08-20",
  },
  {
    id: "3",
    name: "박민수",
    email: "park@example.com",
    image: null,
    role: "INSTRUCTOR",
    plan: "PREMIUM",
    questionsCount: 432,
    lastActive: "2024-01-14",
    status: "active",
    createdAt: "2023-04-10",
  },
  {
    id: "4",
    name: "최수진",
    email: "choi@example.com",
    image: null,
    role: "USER",
    plan: "FREE",
    questionsCount: 123,
    lastActive: "2024-01-10",
    status: "suspended",
    createdAt: "2023-12-01",
  },
  {
    id: "5",
    name: "정우성",
    email: "jung@example.com",
    image: null,
    role: "ADMIN",
    plan: "PREMIUM",
    questionsCount: 2345,
    lastActive: "2024-01-15",
    status: "active",
    createdAt: "2023-01-01",
  },
];

const roleLabels = {
  USER: { label: "사용자", icon: Users },
  INSTRUCTOR: { label: "강사", icon: UserCog },
  ADMIN: { label: "관리자", icon: Shield },
};

const planColors = {
  FREE: "outline",
  BASIC: "secondary",
  PREMIUM: "default",
} as const;

export default function UsersManagementPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    return matchesSearch && matchesRole && matchesPlan;
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success("역할이 변경되었습니다");
  };

  const handleStatusChange = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
    toast.success("상태가 변경되었습니다");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <p className="text-muted-foreground">
          사용자 계정을 관리하고 권한을 설정할 수 있습니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "USER").length}
                </p>
                <p className="text-sm text-muted-foreground">일반 사용자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserCog className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "INSTRUCTOR").length}
                </p>
                <p className="text-sm text-muted-foreground">강사</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.plan === "PREMIUM").length}
                </p>
                <p className="text-sm text-muted-foreground">프리미엄 회원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Ban className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.status === "suspended").length}
                </p>
                <p className="text-sm text-muted-foreground">정지된 계정</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이름 또는 이메일로 검색..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="역할" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 역할</SelectItem>
                <SelectItem value="USER">사용자</SelectItem>
                <SelectItem value="INSTRUCTOR">강사</SelectItem>
                <SelectItem value="ADMIN">관리자</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="플랜" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 플랜</SelectItem>
                <SelectItem value="FREE">무료</SelectItem>
                <SelectItem value="BASIC">베이직</SelectItem>
                <SelectItem value="PREMIUM">프리미엄</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>플랜</TableHead>
                <TableHead>풀이 문제</TableHead>
                <TableHead>최근 활동</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-[70px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleLabels[user.role as keyof typeof roleLabels]?.icon || Users;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <RoleIcon className="h-4 w-4" />
                        <span>
                          {roleLabels[user.role as keyof typeof roleLabels]?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={planColors[user.plan as keyof typeof planColors]}
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.questionsCount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastActive}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "destructive"
                        }
                      >
                        {user.status === "active" ? "활성" : "정지"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            이메일 보내기
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, "USER")}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            사용자로 변경
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, "INSTRUCTOR")}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            강사로 변경
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={
                              user.status === "active"
                                ? "text-red-600"
                                : "text-green-600"
                            }
                            onClick={() => handleStatusChange(user.id)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {user.status === "active" ? "계정 정지" : "정지 해제"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
