import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitSchema = z.object({
  answer: z.union([z.string(), z.array(z.string())]),
  timeSpent: z.number().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questionId = params.id;
    const body = await req.json();
    const { answer, timeSpent } = submitSchema.parse(body);

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, error: "문제를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // Check if answer is correct
    const correctAnswer = question.correctAnswer as string | string[];
    let isCorrect = false;

    if (Array.isArray(correctAnswer) && Array.isArray(answer)) {
      // Multiple select question
      isCorrect =
        correctAnswer.length === answer.length &&
        correctAnswer.every((a) => answer.includes(a));
    } else if (typeof correctAnswer === "string" && typeof answer === "string") {
      isCorrect = correctAnswer === answer;
    }

    // Count previous attempts
    const previousAttempts = await prisma.userAnswer.count({
      where: {
        userId: session.user.id,
        questionId,
      },
    });

    // Save the answer
    const userAnswer = await prisma.userAnswer.create({
      data: {
        userId: session.user.id,
        questionId,
        answer: answer,
        isCorrect,
        timeSpent,
        attemptNumber: previousAttempts + 1,
      },
    });

    // Update question statistics
    await prisma.question.update({
      where: { id: questionId },
      data: {
        totalAttempts: { increment: 1 },
        correctCount: isCorrect ? { increment: 1 } : undefined,
      },
    });

    // Update user analytics
    const existingAnalytics = await prisma.userAnalytics.findUnique({
      where: {
        userId_examType: {
          userId: session.user.id,
          examType: question.examType,
        },
      },
    });

    if (existingAnalytics) {
      await prisma.userAnalytics.update({
        where: {
          userId_examType: {
            userId: session.user.id,
            examType: question.examType,
          },
        },
        data: {
          totalSolved: { increment: 1 },
          totalCorrect: isCorrect ? { increment: 1 } : undefined,
          totalStudyTime: { increment: Math.floor((timeSpent || 0) / 60) },
        },
      });
    } else {
      await prisma.userAnalytics.create({
        data: {
          userId: session.user.id,
          examType: question.examType,
          totalSolved: 1,
          totalCorrect: isCorrect ? 1 : 0,
          totalStudyTime: Math.floor((timeSpent || 0) / 60),
        },
      });
    }

    // Update user experience
    const experienceGain = isCorrect ? 10 : 3;
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        experience: { increment: experienceGain },
        points: { increment: isCorrect ? 5 : 1 },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        userAnswer,
        experienceGain,
      },
    });
  } catch (error) {
    console.error("Answer submit error:", error);
    return NextResponse.json(
      { success: false, error: "답안 제출에 실패했습니다" },
      { status: 500 }
    );
  }
}
