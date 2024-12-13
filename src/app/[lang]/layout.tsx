import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { getDictionary } from "@/get-dictionary";
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const t = await getDictionary(params.lang);

  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <CientHeader
          loginButton={t("loginButton")}
          shop={t("shop")}
          order={t("order")}
          doc={t("doc")}
          local={params.lang}
        />
        <div className="h-[85vh]">{children}</div>

        <CientFooter />
      </body>
    </html>
  );
}
