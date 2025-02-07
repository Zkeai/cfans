"use client";
import React, { useEffect, useState } from "react";
import { Space, Button } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { getDictionary } from "@/get-dictionary";
import { useTranslationStore } from "@/utils/store/translation";

const Page = () => {
  const [t, setT] = useState<(key: string) => string>(() => (key: any) => key);
  const lang = useTranslationStore((state) => state.lang);
  // 提取语言前缀
  const langPrefix = lang === "en" ? "/en" : "/zh";

  const router = useRouter();
  const locale = langPrefix; // 获取当前语言环境

  // 加载翻译词典
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setT(() => dictionary);
    };

    loadDictionary();
  }, [lang]);

  const handleButtonClick = () => {
    window.open("https://github.com/Zkeai", "_blank");
  };

  const handleButtonClick1 = () => {
    router.push(`${locale}/dashboard/createorder`); // 根据语言跳转
  };

  return (
    <div className="h-[80vh] flex flex-col px-6 md:px-28 py-10 md:py-28">
      <title>{langPrefix === "/zh" ? "cfans｜首页" : "cfans｜Home"}</title>

      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="flex flex-col max-w-full md:max-w-2xl">
          <div
            style={{ color: "var(--semi-color-text-1)" }}
            className="text-[24px] leading-[38px] md:text-[40px] md:leading-[54px] font-semibold font_l text-center md:text-left"
          >
            {`Cfans｜${t("indexTitle")}`}
          </div>

          <div
            style={{ color: "var(--semi-color-text-2)" }}
            className="text-[18px] leading-7 md:text-[24px] md:leading-10 text_desc font-semibold my-6 md:my-[24px] mb-8 md:mb-[35px] font_l text-center md:text-left"
          >
            Twitter｜Facebook｜YouTube｜Instagram｜Telegram
          </div>

          <div className="flex justify-center md:justify-start">
            <Space spacing={16}>
              <Button
                size="large"
                theme="solid"
                type="warning"
                style={{ marginRight: 8 }}
                onClick={handleButtonClick1}
              >
                {langPrefix === "/zh" ? "开始使用" : "Get Started"}
              </Button>
              <Button size="large" onClick={handleButtonClick}>
                {langPrefix === "/zh" ? "木鱼代码库" : "Code Repository"}
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
