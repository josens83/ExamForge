import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the pending payment
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (payment.amount !== amount) {
      return NextResponse.json(
        { success: false, error: "Amount mismatch" },
        { status: 400 }
      );
    }

    // Confirm payment with Toss
    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          metadata: tossData,
        },
      });

      return NextResponse.json(
        { success: false, error: tossData.message || "Payment failed" },
        { status: 400 }
      );
    }

    // Update payment status to completed
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "completed",
        paymentKey,
        paidAt: new Date(),
        metadata: tossData,
      },
    });

    // Process based on payment type
    if (payment.type === "membership") {
      // Get membership tier from itemId
      const membershipTier = payment.itemId || "basic";
      const durationDays = getDurationDays(membershipTier);

      // Calculate new expiration date
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { membershipExpiresAt: true },
      });

      const currentExpiry = user?.membershipExpiresAt || new Date();
      const newExpiry = new Date(
        Math.max(currentExpiry.getTime(), Date.now()) + durationDays * 24 * 60 * 60 * 1000
      );

      // Update user membership
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          membership: membershipTier,
          membershipExpiresAt: newExpiry,
        },
      });
    } else if (payment.type === "course" && payment.itemId) {
      // Create course enrollment
      await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: payment.itemId,
          paidAmount: amount,
          paymentMethod: "toss",
          orderId,
        },
      });

      // Increment course enrollment count
      await prisma.course.update({
        where: { id: payment.itemId },
        data: { enrollmentCount: { increment: 1 } },
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      type: payment.type,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}

function getDurationDays(tier: string): number {
  switch (tier) {
    case "basic":
      return 30;
    case "premium":
      return 30;
    case "vip":
      return 30;
    default:
      return 30;
  }
}
