import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
  category: z.enum(["general", "technical", "billing", "partnership", "other"]),
  message: z.string().min(10, "문의 내용은 10자 이상이어야 합니다"),
});

// Rate limiting (simple in-memory store - in production use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, category, message } = validationResult.data;

    // Category display names
    const categoryNames: Record<string, string> = {
      general: "일반 문의",
      technical: "기술 지원",
      billing: "결제/환불",
      partnership: "제휴/협력",
      other: "기타",
    };

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
    if (adminEmail) {
      const adminTemplate = emailTemplates.contactNotification(
        name,
        email,
        categoryNames[category] || category,
        message
      );

      try {
        await sendEmail({
          to: adminEmail,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
        });
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
      }
    }

    // Send confirmation email to user
    const confirmationTemplate = emailTemplates.contactConfirmation(name, message);
    try {
      await sendEmail({
        to: email,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if confirmation email fails
    }

    // Log the contact submission
    console.log("Contact form submission:", {
      name,
      email,
      category,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
