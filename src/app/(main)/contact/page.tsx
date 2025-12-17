"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    title: "이메일",
    content: "support@examforge.co.kr",
    description: "24시간 이내 답변",
  },
  {
    icon: Phone,
    title: "전화",
    content: "1588-0000",
    description: "평일 09:00 - 18:00",
  },
  {
    icon: MessageCircle,
    title: "카카오톡",
    content: "@ExamForge",
    description: "실시간 상담 가능",
  },
  {
    icon: MapPin,
    title: "주소",
    content: "서울시 강남구 테헤란로 123",
    description: "ExamForge 빌딩 10층",
  },
];

const inquiryTypes = [
  { value: "general", label: "일반 문의" },
  { value: "technical", label: "기술 지원" },
  { value: "payment", label: "결제/환불" },
  { value: "partnership", label: "제휴/협력" },
  { value: "feedback", label: "서비스 피드백" },
  { value: "other", label: "기타" },
];

const faqs = [
  {
    question: "무료 체험은 어떻게 이용하나요?",
    answer:
      "회원가입 후 7일간 프리미엄 기능을 무료로 이용할 수 있습니다. 체험 기간 종료 후 자동으로 무료 플랜으로 전환되며, 별도의 결제가 진행되지 않습니다.",
  },
  {
    question: "환불 정책은 어떻게 되나요?",
    answer:
      "구매일로부터 7일 이내, 콘텐츠 이용률 10% 미만인 경우 100% 환불이 가능합니다. 그 이후에는 잔여 기간에 따라 부분 환불이 진행됩니다.",
  },
  {
    question: "강의 자료 다운로드가 가능한가요?",
    answer:
      "PDF 교재와 학습 자료는 다운로드 가능합니다. 단, 영상 강의는 저작권 보호를 위해 스트리밍만 지원됩니다.",
  },
  {
    question: "모바일에서도 학습할 수 있나요?",
    answer:
      "네, iOS와 Android 앱을 제공하며, 웹 브라우저를 통해서도 모바일 학습이 가능합니다. 오프라인 학습 기능도 지원됩니다.",
  },
  {
    question: "결제 수단은 무엇이 있나요?",
    answer:
      "신용카드, 체크카드, 계좌이체, 카카오페이, 네이버페이, 토스 등 다양한 결제 수단을 지원합니다.",
  },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success("문의가 접수되었습니다");
    } catch (error) {
      toast.error("문의 접수 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">문의가 접수되었습니다</h2>
            <p className="text-muted-foreground mb-6">
              빠른 시일 내에 답변 드리겠습니다.
              <br />
              답변은 입력하신 이메일로 발송됩니다.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  type: "",
                  subject: "",
                  message: "",
                });
              }}
            >
              새 문의하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">문의하기</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          궁금한 점이 있으시거나 도움이 필요하시면 언제든 연락 주세요.
          <br />
          최대한 빠르게 답변 드리겠습니다.
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {contactInfo.map((info) => (
          <Card key={info.title}>
            <CardContent className="pt-6">
              <info.icon className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-1">{info.title}</h3>
              <p className="font-medium">{info.content}</p>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>문의 양식</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">문의 유형 *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">제목 *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">문의 내용 *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    문의하기
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>자주 묻는 질문</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                운영 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평일</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">토요일</span>
                  <span>10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">일요일/공휴일</span>
                  <span className="text-muted-foreground">휴무</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                * 이메일 문의는 24시간 접수 가능하며, 영업일 기준 24시간 이내
                답변드립니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
