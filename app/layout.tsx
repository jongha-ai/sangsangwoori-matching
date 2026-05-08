import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "상상우리 매칭 시스템",
  description: "시니어 일자리 자동 매칭 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-lg">
        <header className="bg-blue-700 text-white">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex gap-6 items-center">
            <span className="text-2xl font-bold tracking-tight">상상우리</span>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-lg bg-white text-blue-700 hover:bg-blue-50 transition-colors">프로필 등록</Link>
            <Link href="/recommendations" className="text-sm font-semibold px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">추천 목록</Link>
            <Link href="/admin" className="text-sm font-semibold px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">담당자 대시보드</Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
