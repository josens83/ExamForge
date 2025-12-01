import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  examType: z.string().optional(),
  type: z.enum(["official", "predicted", "practice"]).optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(10),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = { isActive: true };

    if (params.examType) where.examType = params.examType;
    if (params.type) where.type = params.type;
    if (params.difficulty) where.difficulty = params.difficulty;

    const skip = (params.page - 1) * params.pageSize;

    const [mockExams, total] = await Promise.all([
      prisma.mockExam.findMany({
        where,
        skip,
        take: params.pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.mockExam.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: mockExams,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
      },
    });
  } catch (error) {
    console.error("Mock exams fetch error:", error);
    return NextResponse.json(
      { success: false, error: "모의고사 목록을 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}
