import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Metadata } from "next";

import dynamic from "next/dynamic";
const ClientPage = dynamic(() => import("../client/CientPage"), { ssr: false });
export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const t = await getDictionary(lang);

  return (
    <div>
      <ClientPage name={t("title")} />
    </div>
  );
}

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const t = await getDictionary(lang);

  return {
    title: t("title"),
    description: t("description"),
  };
}
