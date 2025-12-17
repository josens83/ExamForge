import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "ExamForge - AI 기반 시험 준비 플랫폼",
    template: "%s | ExamForge",
  },
  description:
    "AI 기반 맞춤형 학습으로 공무원, 자격증 시험 합격을 위한 최적의 솔루션을 제공합니다. 10만+ 무료 문제, AI 논술 채점, 맞춤형 학습 분석",
  keywords: [
    "공무원 시험",
    "9급 공무원",
    "7급 공무원",
    "경찰공무원",
    "소방공무원",
    "자격증 시험",
    "온라인 강의",
    "AI 학습",
    "모의고사",
    "문제은행",
  ],
  authors: [{ name: "ExamForge" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ExamForge",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://examforge.kr",
    siteName: "ExamForge",
    title: "ExamForge - AI 기반 시험 준비 플랫폼",
    description:
      "AI 기반 맞춤형 학습으로 공무원, 자격증 시험 합격을 위한 최적의 솔루션",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ExamForge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ExamForge - AI 기반 시험 준비 플랫폼",
    description:
      "AI 기반 맞춤형 학습으로 공무원, 자격증 시험 합격을 위한 최적의 솔루션",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
