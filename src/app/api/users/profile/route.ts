import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        targetExam: true,
        targetDate: true,
        targetScore: true,
        membership: true,
        membershipExpiresAt: true,
        points: true,
        level: true,
        experience: true,
        totalStudyDays: true,
        currentStreak: true,
        longestStreak: true,
        lastActiveAt: true,
        createdAt: true,
        _count: {
          select: {
            userAnswers: true,
            enrollments: true,
            mockExamAttempts: true,
            bookmarks: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user analytics
    const analytics = await prisma.userAnalytics.findFirst({
      where: { userId: session.user.id },
      select: {
        totalSolved: true,
        totalCorrect: true,
        totalStudyTime: true,
        predictedScore: true,
        percentile: true,
      },
    });

    // Get user achievements count
    const achievementsCount = await prisma.userAchievement.count({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      ...user,
      analytics,
      achievementsCount,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, targetExam, targetDate, targetScore } = body;

    // Validate input
    if (name && (typeof name !== "string" || name.length > 100)) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (targetExam !== undefined) updateData.targetExam = targetExam;
    if (targetDate !== undefined) {
      updateData.targetDate = targetDate ? new Date(targetDate) : null;
    }
    if (targetScore !== undefined) {
      updateData.targetScore = targetScore ? parseFloat(targetScore) : null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        targetExam: true,
        targetDate: true,
        targetScore: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
