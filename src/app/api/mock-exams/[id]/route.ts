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

    const mockExam = await prisma.mockExam.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            questions: {
              select: {
                id: true,
                content: true,
                type: true,
                options: true,
                difficulty: true,
                solveTime: true,
                // Don't include correctAnswer unless in review mode
              },
            },
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    });

    if (!mockExam) {
      return NextResponse.json(
        { error: "Mock exam not found" },
        { status: 404 }
      );
    }

    // Check for user's previous attempts
    const session = await getServerSession(authOptions);
    let userAttempts: any[] = [];

    if (session?.user?.id) {
      userAttempts = await prisma.mockExamAttempt.findMany({
        where: {
          userId: session.user.id,
          mockExamId: id,
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          startedAt: true,
          submittedAt: true,
          timeSpent: true,
          result: true,
        },
      });
    }

    // Check if user has access (free or paid)
    const hasAccess =
      mockExam.isFree ||
      (session?.user?.id &&
        (await checkMockExamAccess(session.user.id, id)));

    return NextResponse.json({
      ...mockExam,
      hasAccess,
      userAttempts,
    });
  } catch (error) {
    console.error("Error fetching mock exam:", error);
    return NextResponse.json(
      { error: "Failed to fetch mock exam" },
      { status: 500 }
    );
  }
}

async function checkMockExamAccess(
  userId: string,
  mockExamId: string
): Promise<boolean> {
  // Check if user has premium membership
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      membership: true,
      membershipExpiresAt: true,
    },
  });

  if (
    user?.membership !== "free" &&
    user?.membershipExpiresAt &&
    user.membershipExpiresAt > new Date()
  ) {
    return true;
  }

  // Check if user has purchased this specific mock exam
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      type: "mock_exam",
      itemId: mockExamId,
      status: "completed",
    },
  });

  return !!payment;
}
