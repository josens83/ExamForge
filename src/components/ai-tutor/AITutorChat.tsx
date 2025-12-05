"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  type?: "hint" | "question" | "explanation" | "encouragement";
}

interface AITutorChatProps {
  questionId?: string;
  questionContent?: string;
  subject?: string;
  onClose?: () => void;
}

const QUICK_PROMPTS = [
  { label: "힌트 주세요", prompt: "이 문제에 대한 힌트를 주세요. 답을 직접 알려주지 말고, 생각의 방향을 안내해주세요." },
  { label: "개념 설명", prompt: "이 문제와 관련된 핵심 개념을 설명해주세요." },
  { label: "비슷한 예시", prompt: "이 문제와 비슷한 쉬운 예시로 설명해주세요." },
  { label: "왜 틀렸을까요?", prompt: "제가 틀린 이유가 뭘까요? 어떤 개념을 놓쳤을까요?" },
];

export function AITutorChat({
  questionId,
  questionContent,
  subject,
  onClose,
}: AITutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `안녕하세요! 저는 AI 튜터 '포지'입니다 🎓\n\n저는 답을 직접 알려드리기보다, 여러분이 스스로 답을 찾을 수 있도록 도와드릴게요. 소크라테스식 질문법으로 함께 생각해봐요!\n\n${questionContent ? "이 문제에 대해 어떤 것이 궁금하신가요?" : "무엇이든 물어보세요!"}`,
      timestamp: new Date(),
      type: "encouragement",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          questionId,
          questionContent,
          subject,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          type: data.responseType || "explanation",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case "hint":
        return "💡";
      case "question":
        return "🤔";
      case "explanation":
        return "📚";
      case "encouragement":
        return "💪";
      default:
        return "";
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      <CardHeader className="border-b py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <CardTitle className="text-lg">AI 튜터 포지</CardTitle>
            <Badge variant="secondary" className="text-xs">
              소크라테스식 학습
            </Badge>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.role === "assistant" && message.type && (
                <span className="mr-1">{getMessageTypeIcon(message.type)}</span>
              )}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              <div
                className={cn(
                  "text-xs mt-1",
                  message.role === "user"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {message.timestamp.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2">
              <div className="flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4">
        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_PROMPTS.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPrompt(item.prompt)}
              disabled={isLoading}
              className="text-xs"
            >
              {item.label}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Textarea
            placeholder="질문을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            전송
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          포지는 답을 직접 알려주지 않고, 스스로 생각할 수 있도록 안내합니다
        </p>
      </div>
    </Card>
  );
}
