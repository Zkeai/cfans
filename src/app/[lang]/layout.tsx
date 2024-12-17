import "./globals.css";
import type { Metadata } from "next";

import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import { getDictionary } from "@/get-dictionary";
import { SessionProvider } from "next-auth/react";
import { useTranslationStore } from "@/store/translation";
const CientHeader = dynamic(() => import("../client/ClientHeader"), {
  ssr: false,
});
const CientFooter = dynamic(() => import("../client/ClientFooter"), {
  ssr: false,
});
// 加载 Google 字体
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "cfans ｜ web3",
  description: "cfans for web3",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: "zh" | "en" };
}) {
  const t = await getDictionary(params.lang);

  // 使用 Zustand 的 setT 存储翻译函数
  useTranslationStore.getState().setlang(params.lang);

  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <SessionProvider>
          <CientHeader
            loginButton={t("loginButton")}
            shop={t("shop")}
            order={t("order")}
            doc={t("doc")}
            manageUser={t("manageUser")}
            lagout={t("lagout")}
            local={params.lang}
          />
          <div className="h-[85vh]">{children}</div>

          <CientFooter content={t("footer")} />
        </SessionProvider>
      </body>
    </html>
  );
}
