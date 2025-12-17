"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Moon,
  Sun,
  Globe,
  CreditCard,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Camera,
  Calendar,
  Target,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock user data
const mockUser = {
  name: "김수험",
  email: "kim@example.com",
  phone: "010-1234-5678",
  image: null,
  targetExam: "gosi_9",
  targetDate: "2024-04-06",
  targetScore: 85,
};

const examTypes = [
  { value: "gosi_9", label: "9급 공무원" },
  { value: "gosi_7", label: "7급 공무원" },
  { value: "police", label: "경찰공무원" },
  { value: "fire", label: "소방공무원" },
  { value: "teacher", label: "교원임용" },
];

export default function SettingsPage() {
  const [name, setName] = useState(mockUser.name);
  const [phone, setPhone] = useState(mockUser.phone);
  const [targetExam, setTargetExam] = useState(mockUser.targetExam);
  const [targetDate, setTargetDate] = useState(mockUser.targetDate);
  const [targetScore, setTargetScore] = useState(mockUser.targetScore.toString());

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [studyReminder, setStudyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Display settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ko");

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground mt-2">
          계정 및 앱 설정을 관리하세요
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="display">화면</TabsTrigger>
          <TabsTrigger value="account">계정</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>프로필 사진</CardTitle>
              <CardDescription>
                다른 사용자에게 표시되는 프로필 이미지입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockUser.image || ""} />
                  <AvatarFallback className="text-3xl">
                    {name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Camera className="mr-2 h-4 w-4" />
                    사진 변경
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG 형식 / 최대 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>
                이름과 연락처 정보를 수정하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    value={mockUser.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">휴대폰 번호</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card>
            <CardHeader>
              <CardTitle>학습 목표</CardTitle>
              <CardDescription>
                목표 시험과 일정을 설정하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetExam">목표 시험</Label>
                  <Select value={targetExam} onValueChange={setTargetExam}>
                    <SelectTrigger>
                      <SelectValue placeholder="시험 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((exam) => (
                        <SelectItem key={exam.value} value={exam.value}>
                          {exam.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDate">목표 시험일</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetScore">목표 점수</Label>
                  <Input
                    id="targetScore"
                    type="number"
                    min="0"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>
              <Save className="mr-2 h-4 w-4" />
              변경사항 저장
            </Button>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>
                받고 싶은 알림을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    중요한 업데이트를 이메일로 받습니다
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>푸시 알림</Label>
                  <p className="text-sm text-muted-foreground">
                    브라우저 푸시 알림을 받습니다
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>학습 리마인더</Label>
                  <p className="text-sm text-muted-foreground">
                    매일 학습 시간에 알림을 받습니다
                  </p>
                </div>
                <Switch
                  checked={studyReminder}
                  onCheckedChange={setStudyReminder}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>주간 학습 리포트</Label>
                  <p className="text-sm text-muted-foreground">
                    매주 학습 현황을 이메일로 받습니다
                  </p>
                </div>
                <Switch
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>마케팅 이메일</Label>
                  <p className="text-sm text-muted-foreground">
                    이벤트 및 프로모션 정보를 받습니다
                  </p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>화면 설정</CardTitle>
              <CardDescription>
                앱 표시 방식을 설정하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    다크 모드
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    어두운 테마를 사용합니다
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    언어
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    앱 표시 언어를 선택하세요
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle>보안</CardTitle>
              <CardDescription>
                계정 보안 설정을 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">비밀번호 변경</p>
                    <p className="text-sm text-muted-foreground">
                      정기적으로 비밀번호를 변경하세요
                    </p>
                  </div>
                </div>
                <Button variant="outline">변경</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">2단계 인증</p>
                    <p className="text-sm text-muted-foreground">
                      추가 보안 계층을 설정하세요
                    </p>
                  </div>
                </div>
                <Button variant="outline">설정</Button>
              </div>
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>연결된 계정</CardTitle>
              <CardDescription>
                소셜 계정 연결을 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#FEE500] flex items-center justify-center">
                    <span className="text-black font-bold text-sm">K</span>
                  </div>
                  <div>
                    <p className="font-medium">카카오</p>
                    <p className="text-sm text-muted-foreground">연결됨</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">연결 해제</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center">
                    <span className="font-bold text-sm">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">연결 안됨</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">연결</Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>구독 및 결제</CardTitle>
              <CardDescription>
                멤버십과 결제 정보를 관리하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">결제 수단</p>
                    <p className="text-sm text-muted-foreground">
                      등록된 카드: **** 1234
                    </p>
                  </div>
                </div>
                <Button variant="outline">관리</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">현재 플랜: 프리미엄</p>
                  <p className="text-sm text-muted-foreground">
                    2024년 12월 31일까지
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/pricing">플랜 변경</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-red-500">위험 구역</CardTitle>
              <CardDescription>
                이 작업은 되돌릴 수 없습니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">로그아웃</p>
                    <p className="text-sm text-muted-foreground">
                      모든 기기에서 로그아웃합니다
                    </p>
                  </div>
                </div>
                <Button variant="outline">로그아웃</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-500">계정 삭제</p>
                    <p className="text-sm text-muted-foreground">
                      모든 데이터가 영구적으로 삭제됩니다
                    </p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">삭제</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>정말 계정을 삭제하시겠습니까?</AlertDialogTitle>
                      <AlertDialogDescription>
                        이 작업은 되돌릴 수 없습니다. 모든 학습 기록, 구매 내역,
                        설정이 영구적으로 삭제됩니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                        계정 삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
