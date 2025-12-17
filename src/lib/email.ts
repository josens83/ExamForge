import nodemailer from "nodemailer";

// Email configuration
const getTransporter = () => {
  // For development, use ethereal email (fake SMTP for testing)
  if (process.env.NODE_ENV === "development" && !process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "test@ethereal.email",
        pass: process.env.SMTP_PASS || "testpass",
      },
    });
  }

  // Production email configuration
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "ExamForge <noreply@examforge.com>",
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ""),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    // For development with ethereal, log preview URL
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("이메일 전송에 실패했습니다");
  }
}

// Email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName?: string) => ({
    subject: "[ExamForge] 비밀번호 재설정",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>비밀번호 재설정</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 ExamForge</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">AI 기반 시험 준비 플랫폼</p>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">비밀번호 재설정 요청</h2>

          <p>안녕하세요${userName ? ` ${userName}님` : ""},</p>

          <p>ExamForge 계정의 비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새로운 비밀번호를 설정해 주세요.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              비밀번호 재설정
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            이 링크는 <strong>1시간</strong> 후에 만료됩니다.
          </p>

          <p style="color: #666; font-size: 14px;">
            만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.
            계정은 안전하게 유지됩니다.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #999; font-size: 12px; margin: 0;">
            버튼이 작동하지 않는 경우, 아래 링크를 브라우저에 복사하여 붙여넣기 해주세요:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ExamForge. All rights reserved.</p>
          <p>이 이메일은 ExamForge에서 자동으로 발송되었습니다.</p>
        </div>
      </body>
      </html>
    `,
  }),

  welcomeEmail: (userName: string, verifyUrl?: string) => ({
    subject: "[ExamForge] 가입을 환영합니다!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>환영합니다</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 ExamForge</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">AI 기반 시험 준비 플랫폼</p>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">환영합니다, ${userName}님! 🎉</h2>

          <p>ExamForge에 가입해 주셔서 감사합니다!</p>

          <p>이제 다음 기능들을 이용하실 수 있습니다:</p>

          <ul style="color: #555;">
            <li>📚 <strong>맞춤형 학습</strong> - AI가 분석한 취약점 기반 문제 추천</li>
            <li>🤖 <strong>AI 튜터</strong> - 24시간 질문에 답변하는 개인 튜터</li>
            <li>📊 <strong>학습 분석</strong> - 상세한 학습 통계와 진도 관리</li>
            <li>🏆 <strong>게이미피케이션</strong> - 리그 시스템과 업적으로 동기부여</li>
            <li>👥 <strong>스터디 그룹</strong> - 함께 공부하는 커뮤니티</li>
          </ul>

          ${verifyUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              이메일 인증하기
            </a>
          </div>
          ` : ""}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #333; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
              학습 시작하기
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

          <p style="color: #666; font-size: 14px;">
            궁금한 점이 있으시면 언제든지 <a href="mailto:support@examforge.com" style="color: #667eea;">support@examforge.com</a>으로 문의해 주세요.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ExamForge. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  }),

  contactConfirmation: (userName: string, message: string) => ({
    subject: "[ExamForge] 문의가 접수되었습니다",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>문의 접수 확인</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 ExamForge</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">문의가 접수되었습니다</h2>

          <p>안녕하세요 ${userName}님,</p>

          <p>고객님의 문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.</p>

          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <strong>문의 내용:</strong>
            <p style="margin: 10px 0 0; white-space: pre-wrap;">${message}</p>
          </div>

          <p style="color: #666; font-size: 14px;">
            평균 응답 시간은 영업일 기준 1-2일입니다.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ExamForge. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  }),

  contactNotification: (
    name: string,
    email: string,
    category: string,
    message: string
  ) => ({
    subject: `[ExamForge 문의] ${category} - ${name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>새 문의가 접수되었습니다</h2>

        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">이름</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">이메일</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">카테고리</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${category}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">문의 내용</td>
            <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">
          <a href="mailto:${email}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            답변하기
          </a>
        </p>
      </body>
      </html>
    `,
  }),
};
