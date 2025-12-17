"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  FileQuestion,
  Filter,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data
const mockQuestions = [
  {
    id: "1",
    content: "다음 중 헌법 제1조에 명시된 대한민국의 국체는?",
    subject: "헌법",
    difficulty: "medium",
    correctRate: 75,
    solvedCount: 1234,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    content: "행정행위의 부관에 해당하지 않는 것은?",
    subject: "행정법",
    difficulty: "hard",
    correctRate: 45,
    solvedCount: 856,
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    content: "다음 중 민법상 물권의 객체가 될 수 없는 것은?",
    subject: "민법",
    difficulty: "easy",
    correctRate: 82,
    solvedCount: 432,
    status: "draft",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    content: "국회의원의 면책특권에 대한 설명으로 옳지 않은 것은?",
    subject: "헌법",
    difficulty: "hard",
    correctRate: 38,
    solvedCount: 678,
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    content: "다음 중 형법상 책임조각사유에 해당하는 것은?",
    subject: "형법",
    difficulty: "medium",
    correctRate: 62,
    solvedCount: 543,
    status: "active",
    createdAt: "2024-01-11",
  },
];

const difficultyLabels = {
  easy: { label: "쉬움", color: "bg-green-100 text-green-800" },
  medium: { label: "보통", color: "bg-yellow-100 text-yellow-800" },
  hard: { label: "어려움", color: "bg-red-100 text-red-800" },
};

export default function QuestionsManagementPage() {
  const [questions, setQuestions] = useState(mockQuestions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    content: "",
    subject: "",
    difficulty: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || q.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = [...new Set(questions.map((q) => q.subject))];

  const handleCreate = () => {
    if (!newQuestion.content || !newQuestion.subject || !newQuestion.difficulty) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    const question = {
      id: String(questions.length + 1),
      content: newQuestion.content,
      subject: newQuestion.subject,
      difficulty: newQuestion.difficulty,
      correctRate: 0,
      solvedCount: 0,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setQuestions([question, ...questions]);
    setNewQuestion({
      content: "",
      subject: "",
      difficulty: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    });
    setIsCreateOpen(false);
    toast.success("문제가 생성되었습니다");
  };

  const handleDelete = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success("문제가 삭제되었습니다");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">문제 관리</h1>
          <p className="text-muted-foreground">
            문제 은행을 관리하고 새 문제를 추가할 수 있습니다.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 문제
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>새 문제 만들기</DialogTitle>
              <DialogDescription>
                새로운 문제의 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="content">문제 내용 *</Label>
                <Textarea
                  id="content"
                  value={newQuestion.content}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, content: e.target.value })
                  }
                  placeholder="문제 내용을 입력하세요"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">과목 *</Label>
                  <Select
                    value={newQuestion.subject}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, subject: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="헌법">헌법</SelectItem>
                      <SelectItem value="행정법">행정법</SelectItem>
                      <SelectItem value="민법">민법</SelectItem>
                      <SelectItem value="형법">형법</SelectItem>
                      <SelectItem value="국어">국어</SelectItem>
                      <SelectItem value="영어">영어</SelectItem>
                      <SelectItem value="한국사">한국사</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">난이도 *</Label>
                  <Select
                    value={newQuestion.difficulty}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">쉬움</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="hard">어려움</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>선택지</Label>
                {newQuestion.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    placeholder={`${index + 1}번 선택지`}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="correctAnswer">정답</Label>
                <Select
                  value={newQuestion.correctAnswer}
                  onValueChange={(value) =>
                    setNewQuestion({ ...newQuestion, correctAnswer: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="정답 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1번</SelectItem>
                    <SelectItem value="2">2번</SelectItem>
                    <SelectItem value="3">3번</SelectItem>
                    <SelectItem value="4">4번</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">해설</Label>
                <Textarea
                  id="explanation"
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, explanation: e.target.value })
                  }
                  placeholder="해설을 입력하세요"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreate}>생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="문제 내용으로 검색..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="과목" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 과목</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">문제</TableHead>
                <TableHead>과목</TableHead>
                <TableHead>난이도</TableHead>
                <TableHead>정답률</TableHead>
                <TableHead>풀이수</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-[70px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <FileQuestion className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{question.content}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        difficultyLabels[question.difficulty as keyof typeof difficultyLabels]?.color
                      }`}
                    >
                      {difficultyLabels[question.difficulty as keyof typeof difficultyLabels]?.label}
                    </span>
                  </TableCell>
                  <TableCell>{question.correctRate}%</TableCell>
                  <TableCell>{question.solvedCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        question.status === "active" ? "default" : "secondary"
                      }
                    >
                      {question.status === "active" ? "활성" : "초안"}
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
                          <Eye className="mr-2 h-4 w-4" />
                          미리보기
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(question.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
