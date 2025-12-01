import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const gradeSchema = z.object({
  questionId: z.string(),
  content: z.string().min(10, "답안은 최소 10자 이상이어야 합니다"),
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, content } = gradeSchema.parse(body);

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.type !== "essay") {
      return NextResponse.json(
        { success: false, error: "논술형 문제를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    const wordCount = content.trim().split(/\s+/).length;
    const startTime = Date.now();

    // AI Grading with Claude
    const gradingPrompt = `당신은 전문 시험 채점관입니다. 다음 논술 답안을 채점해주세요.

## 문제
${question.content}

## 학생 답안
${content}

## 채점 지침
1. 총점은 100점 만점으로 채점합니다.
2. 다음 기준에 따라 채점하세요:
   - 논리적 구성 (30점): 논거 전개의 체계성, 문단 구성
   - 핵심 개념 이해 (30점): 관련 개념의 정확한 이해와 적용
   - 표현력 (30점): 문장 구성력, 어휘 사용의 적절성
   - 분량 및 형식 (10점): 적절한 분량, 형식 준수
3. 구체적이고 건설적인 피드백을 제공하세요.

다음 JSON 형식으로 응답해주세요:
{
  "totalScore": <총점>,
  "rubricScores": [
    {"criterion": "논리적 구성", "score": <점수>, "maxScore": 30, "feedback": "<피드백>"},
    {"criterion": "핵심 개념 이해", "score": <점수>, "maxScore": 30, "feedback": "<피드백>"},
    {"criterion": "표현력", "score": <점수>, "maxScore": 30, "feedback": "<피드백>"},
    {"criterion": "분량 및 형식", "score": <점수>, "maxScore": 10, "feedback": "<피드백>"}
  ],
  "overallFeedback": "<전체 피드백>",
  "strengths": ["<강점1>", "<강점2>"],
  "improvements": ["<개선점1>", "<개선점2>"]
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: gradingPrompt,
        },
      ],
    });

    const gradingTime = Date.now() - startTime;

    // Parse the response
    let aiGrading;
    try {
      const responseText =
        response.content[0].type === "text" ? response.content[0].text : "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiGrading = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("AI response parse error:", parseError);
      aiGrading = {
        totalScore: 0,
        rubricScores: [],
        overallFeedback: "채점 결과를 처리하는데 오류가 발생했습니다.",
        strengths: [],
        improvements: [],
      };
    }

    // Save the submission
    const submission = await prisma.essaySubmission.create({
      data: {
        userId: session.user.id,
        questionId,
        content,
        wordCount,
        aiGrading: {
          ...aiGrading,
          maxScore: 100,
          percentage: aiGrading.totalScore,
          plagiarismScore: 0,
          gradedAt: new Date(),
          gradingTime,
        },
      },
    });

    // Update user experience
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        experience: { increment: 50 },
        points: { increment: 10 },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        submission,
        grading: {
          ...aiGrading,
          maxScore: 100,
          percentage: aiGrading.totalScore,
          gradingTime,
        },
      },
    });
  } catch (error) {
    console.error("Essay grading error:", error);
    return NextResponse.json(
      { success: false, error: "논술 채점에 실패했습니다" },
      { status: 500 }
    );
  }
}
