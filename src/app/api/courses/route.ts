import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  examType: z.string().optional(),
  subject: z.string().optional(),
  level: z.string().optional(),
  courseType: z.string().optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(12),
  sortBy: z.enum(["popular", "rating", "newest", "price"]).default("popular"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    const where: Record<string, unknown> = { isPublished: true };

    if (params.examType) where.examType = params.examType;
    if (params.subject) where.subject = params.subject;
    if (params.level) where.level = params.level;
    if (params.courseType) where.courseType = params.courseType;

    const orderBy: Record<string, unknown> = {};
    switch (params.sortBy) {
      case "popular":
        orderBy.enrollmentCount = "desc";
        break;
      case "rating":
        orderBy.rating = "desc";
        break;
      case "newest":
        orderBy.createdAt = "desc";
        break;
      case "price":
        orderBy.salePrice = "asc";
        break;
    }

    const skip = (params.page - 1) * params.pageSize;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
              avgRating: true,
            },
          },
        },
        skip,
        take: params.pageSize,
        orderBy,
      }),
      prisma.course.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: courses,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
      },
    });
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { success: false, error: "강의 목록을 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}
