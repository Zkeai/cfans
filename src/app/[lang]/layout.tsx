import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
const CientHeader = dynamic(() => import("../client/ClientHeader"), {
  ssr: false,
});
const CientFooter = dynamic(() => import("../client/ClientFooter"), {
  ssr: false,
});
// 加载 Google 字体
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js I18N App",
  description: "A Next.js app with server-side internationalization",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <CientHeader />
        <div className="h-[85vh]">{children}</div>

        <CientFooter />
      </body>
    </html>
  );
}
