"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
const mockCourses = [
  {
    id: "1",
    title: "9급 공무원 행정법 완전정복",
    category: "공무원",
    instructor: "김행정",
    price: 99000,
    enrollments: 1234,
    status: "published",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "TOEIC 900점 달성 전략",
    category: "어학",
    instructor: "이영어",
    price: 79000,
    enrollments: 856,
    status: "published",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "CPA 회계원리 기초반",
    category: "자격증",
    instructor: "박회계",
    price: 149000,
    enrollments: 432,
    status: "draft",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    title: "공인중개사 민법 특강",
    category: "자격증",
    instructor: "최부동",
    price: 89000,
    enrollments: 678,
    status: "published",
    createdAt: "2024-01-03",
  },
];

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    instructor: "",
  });

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (!newCourse.title || !newCourse.category) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    const course = {
      id: String(courses.length + 1),
      title: newCourse.title,
      category: newCourse.category,
      instructor: newCourse.instructor || "미지정",
      price: Number(newCourse.price) || 0,
      enrollments: 0,
      status: "draft",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setCourses([course, ...courses]);
    setNewCourse({ title: "", description: "", category: "", price: "", instructor: "" });
    setIsCreateOpen(false);
    toast.success("강좌가 생성되었습니다");
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    toast.success("강좌가 삭제되었습니다");
  };

  const toggleStatus = (id: string) => {
    setCourses(
      courses.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "published" ? "draft" : "published" }
          : c
      )
    );
    toast.success("상태가 변경되었습니다");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">강좌 관리</h1>
          <p className="text-muted-foreground">
            강좌를 생성, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 강좌
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 강좌 만들기</DialogTitle>
              <DialogDescription>
                새로운 강좌의 정보를 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">강좌명 *</Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  placeholder="강좌명을 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="강좌 설명을 입력하세요"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select
                    value={newCourse.category}
                    onValueChange={(value) =>
                      setNewCourse({ ...newCourse, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="공무원">공무원</SelectItem>
                      <SelectItem value="자격증">자격증</SelectItem>
                      <SelectItem value="어학">어학</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">가격 (원)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newCourse.price}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, price: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">강사명</Label>
                <Input
                  id="instructor"
                  value={newCourse.instructor}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, instructor: e.target.value })
                  }
                  placeholder="강사명을 입력하세요"
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
                placeholder="강좌명 또는 강사명으로 검색..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>강좌명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>강사</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>수강생</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-[70px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>₩{course.price.toLocaleString()}</TableCell>
                  <TableCell>{course.enrollments.toLocaleString()}명</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "published" ? "default" : "secondary"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleStatus(course.id)}
                    >
                      {course.status === "published" ? "게시됨" : "초안"}
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
                          보기
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(course.id)}
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
