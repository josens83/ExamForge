import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  examType: z.string().optional(),
  subject: z.string().optional(),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  type: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(20),
  random: z.coerce.boolean().default(false),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = { isActive: true };

    if (params.examType) where.examType = params.examType;
    if (params.subject) where.subject = params.subject;
    if (params.difficulty) where.difficulty = params.difficulty;
    if (params.type) where.type = params.type;

    const skip = (params.page - 1) * params.pageSize;

    let questions;
    let total;

    if (params.random) {
      // Get random questions
      const allIds = await prisma.question.findMany({
        where,
        select: { id: true },
      });

      // Shuffle and take pageSize
      const shuffled = allIds.sort(() => Math.random() - 0.5);
      const selectedIds = shuffled.slice(0, params.pageSize).map((q) => q.id);

      questions = await prisma.question.findMany({
        where: { id: { in: selectedIds } },
      });

      total = allIds.length;
    } else {
      [questions, total] = await Promise.all([
        prisma.question.findMany({
          where,
          skip,
          take: params.pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prisma.question.count({ where }),
      ]);
    }

    return NextResponse.json({
      success: true,
      data: {
        items: questions,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
      },
    });
  } catch (error) {
    console.error("Questions fetch error:", error);
    return NextResponse.json(
      { success: false, error: "문제 목록을 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}

// Create new question (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const question = await prisma.question.create({
      data: {
        examType: body.examType,
        subject: body.subject,
        chapter: body.chapter,
        topic: body.topic,
        tags: body.tags || [],
        type: body.type,
        content: body.content,
        options: body.options,
        correctAnswer: body.correctAnswer,
        explanation: body.explanation,
        difficulty: body.difficulty || 3,
        solveTime: body.solveTime || 60,
        source: body.source,
        year: body.year,
        aiHints: body.aiHints || [],
        relatedQuestions: body.relatedQuestions || [],
      },
    });

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    console.error("Question create error:", error);
    return NextResponse.json(
      { success: false, error: "문제 생성에 실패했습니다" },
      { status: 500 }
    );
  }
}
