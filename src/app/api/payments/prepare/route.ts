import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

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
    const { type, itemId, amount } = body;

    if (!type || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${uuidv4().slice(0, 8)}`;

    // Create pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        type,
        itemId,
        amount,
        currency: "KRW",
        status: "pending",
        provider: "toss",
        orderId,
      },
    });

    return NextResponse.json({
      success: true,
      orderId,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error("Payment preparation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to prepare payment" },
      { status: 500 }
    );
  }
}
