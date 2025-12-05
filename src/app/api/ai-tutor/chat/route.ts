import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `당신은 '포지'라는 이름의 AI 튜터입니다. 한국의 공무원 시험 및 자격증 시험 준비생들을 돕습니다.

## 핵심 원칙

1. **소크라테스식 교육법**: 답을 직접 알려주지 마세요. 대신 학생이 스스로 답을 찾도록 질문으로 유도하세요.

2. **단계적 힌트 제공**:
   - 1단계: 관련 개념이 무엇인지 질문
   - 2단계: 그 개념의 핵심 원리 상기시키기
   - 3단계: 문제에 어떻게 적용할지 유도
   - 4단계: 최종적으로 스스로 답을 도출하도록 안내

3. **긍정적 강화**: 학생의 노력과 진전을 인정하고 격려하세요.

4. **맞춤형 설명**: 학생의 수준에 맞춰 설명하세요. 쉬운 비유와 예시를 활용하세요.

5. **오개념 교정**: 학생이 잘못 이해한 부분이 있다면, 왜 그 생각이 틀렸는지 질문을 통해 깨닫게 해주세요.

## 응답 형식

- 한국어로 응답하세요
- 친근하지만 전문적인 톤을 유지하세요
- 이모지를 적절히 사용하세요
- 긴 설명보다는 대화형으로 짧게 주고받으세요
- 각 응답 후 학생이 생각할 수 있는 질문을 던지세요

## 금지사항

- 직접적인 정답 제공 (학생이 3회 이상 틀리거나 명시적으로 포기 선언 전까지)
- 부정적이거나 비판적인 언어 사용
- 과도하게 긴 설명

## 예시 대화

학생: "이 문제 답이 뭐예요?"
포지: "음, 먼저 이 문제가 어떤 개념을 다루고 있다고 생각하세요? 🤔"

학생: "행정행위의 부관인 것 같아요"
포지: "맞아요! 좋은 출발이에요 👍 그렇다면 행정행위의 부관 중에서 어떤 종류들이 있는지 기억나시나요?"

학생: "조건, 기한, 부담... 있는 것 같은데 헷갈려요"
포지: "잘 기억하고 계시네요! 그중에서 '조건'과 '기한'의 차이점이 뭘까요? 힌트: 확실성과 관련이 있어요 💡"`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, questionId, questionContent, subject } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Messages are required" },
        { status: 400 }
      );
    }

    // Build context from question if provided
    let contextMessage = "";
    if (questionContent) {
      contextMessage = `\n\n[현재 문제 컨텍스트]\n문제 ID: ${questionId}\n과목: ${subject || "미지정"}\n문제 내용: ${questionContent}\n\n위 문제에 대해 학생이 질문하고 있습니다.`;
    }

    // Convert messages to Anthropic format
    const anthropicMessages: { role: "user" | "assistant"; content: string }[] = messages
      .filter((m: ChatMessage) => m.role !== "system")
      .map((m: ChatMessage) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT + contextMessage,
      messages: anthropicMessages,
    });

    const contentBlock = response.content[0];
    const assistantResponse = contentBlock.type === "text" ? contentBlock.text : "";

    // Determine response type based on content
    let responseType = "explanation";
    if (assistantResponse.includes("💡") || assistantResponse.includes("힌트")) {
      responseType = "hint";
    } else if (assistantResponse.includes("🤔") || assistantResponse.endsWith("?")) {
      responseType = "question";
    } else if (assistantResponse.includes("👍") || assistantResponse.includes("잘")) {
      responseType = "encouragement";
    }

    return NextResponse.json({
      success: true,
      response: assistantResponse,
      responseType,
    });
  } catch (error) {
    console.error("AI Tutor chat error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}
