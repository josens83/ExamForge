import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const examType = searchParams.get("examType");

    // Get user analytics
    const analyticsWhere: Record<string, unknown> = {
      userId: session.user.id,
    };
    if (examType) {
      analyticsWhere.examType = examType;
    }

    const analytics = await prisma.userAnalytics.findMany({
      where: analyticsWhere,
    });

    // Get recent answers for trend analysis
    const recentAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      include: {
        question: {
          select: {
            subject: true,
            topic: true,
            difficulty: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate subject-wise statistics
    const subjectStats: Record<
      string,
      { total: number; correct: number; totalTime: number }
    > = {};

    recentAnswers.forEach((answer) => {
      const subject = answer.question.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, correct: 0, totalTime: 0 };
      }
      subjectStats[subject].total++;
      if (answer.isCorrect) subjectStats[subject].correct++;
      subjectStats[subject].totalTime += answer.timeSpent || 0;
    });

    const formattedSubjectStats = Object.entries(subjectStats).map(
      ([subject, stats]) => ({
        subject,
        totalSolved: stats.total,
        accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        avgTimePerQuestion:
          stats.total > 0 ? stats.totalTime / stats.total : 0,
        trend: "stable" as const,
        recentAccuracy:
          stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      })
    );

    // Identify weak topics
    const topicStats: Record<
      string,
      { subject: string; total: number; correct: number }
    > = {};

    recentAnswers.forEach((answer) => {
      const topic = answer.question.topic || "기타";
      const key = `${answer.question.subject}-${topic}`;
      if (!topicStats[key]) {
        topicStats[key] = {
          subject: answer.question.subject,
          total: 0,
          correct: 0,
        };
      }
      topicStats[key].total++;
      if (answer.isCorrect) topicStats[key].correct++;
    });

    const weakTopics = Object.entries(topicStats)
      .map(([key, stats]) => {
        const [subject, topic] = key.split("-");
        const accuracy =
          stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
        return {
          subject,
          topic,
          accuracy,
          totalAttempts: stats.total,
          recommendedQuestions: [],
          priority:
            accuracy < 50
              ? ("high" as const)
              : accuracy < 70
                ? ("medium" as const)
                : ("low" as const),
        };
      })
      .filter((t) => t.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);

    // Get user streak info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        currentStreak: true,
        longestStreak: true,
        totalStudyDays: true,
        level: true,
        experience: true,
        points: true,
      },
    });

    // Calculate predicted score (simple model)
    const totalStats = analytics.reduce(
      (acc, a) => ({
        totalSolved: acc.totalSolved + a.totalSolved,
        totalCorrect: acc.totalCorrect + a.totalCorrect,
      }),
      { totalSolved: 0, totalCorrect: 0 }
    );

    const overallAccuracy =
      totalStats.totalSolved > 0
        ? (totalStats.totalCorrect / totalStats.totalSolved) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        subjectStats: formattedSubjectStats,
        weakTopics,
        user,
        summary: {
          totalSolved: totalStats.totalSolved,
          totalCorrect: totalStats.totalCorrect,
          overallAccuracy,
          predictedScore: Math.min(100, overallAccuracy * 1.1),
          recentActivity: recentAnswers.length,
        },
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { success: false, error: "분석 데이터를 불러오는데 실패했습니다" },
      { status: 500 }
    );
  }
}
