import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/Provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "中国车企数据分析: 股价与销量关联",
  description: "深度分析中国新能源及传统车企的销量增长与股价表现的关联性。",
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        <ReduxProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
