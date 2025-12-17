import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            title: true,
            bio: true,
            avatar: true,
            totalStudents: true,
            totalCourses: true,
            avgRating: true,
          },
        },
        chapters: {
          orderBy: { number: "asc" },
          include: {
            lessons: {
              orderBy: { number: "asc" },
              select: {
                id: true,
                number: true,
                title: true,
                type: true,
                duration: true,
                isFree: true,
              },
            },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is enrolled
    const session = await getServerSession(authOptions);
    let isEnrolled = false;
    let enrollment = null;

    if (session?.user?.id) {
      enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: id,
          },
        },
        select: {
          id: true,
          progress: true,
          currentLessonId: true,
          status: true,
        },
      });
      isEnrolled = !!enrollment;
    }

    return NextResponse.json({
      ...course,
      isEnrolled,
      enrollment,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
