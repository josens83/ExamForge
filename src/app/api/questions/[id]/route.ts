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

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        bookmarks: {
          select: {
            id: true,
            userId: true,
          },
        },
        _count: {
          select: {
            userAnswers: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Get session to check if user has bookmarked
    const session = await getServerSession(authOptions);
    const isBookmarked = session?.user?.id
      ? question.bookmarks.some((b) => b.userId === session.user.id)
      : false;

    // Calculate correct rate
    const correctRate =
      question.totalAttempts > 0
        ? Math.round((question.correctCount / question.totalAttempts) * 100)
        : 0;

    return NextResponse.json({
      ...question,
      correctRate,
      isBookmarked,
      bookmarks: undefined, // Remove bookmarks array from response
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}
