"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n } from "@/i18n-config";
import { useEffect, useState } from "react";
import { Button, Dropdown } from "@douyinfe/semi-ui";
import { IconLanguage } from "@douyinfe/semi-icons";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("");

  useEffect(() => {
    // 从路径中读取当前语言
    const segments = pathName?.split("/") || [];
    const initialLocale = segments[1] || i18n.defaultLocale;
    setCurrentLocale(initialLocale);
  }, [pathName]);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const handleLocaleChange = (locale: string) => {
    if (locale !== currentLocale) {
      const newPath = redirectedPathName(locale);
      router.push(newPath);
    }
  };

  return (
    <Dropdown
      trigger="click"
      position="bottom"
      render={
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleLocaleChange("en")}>
            {currentLocale === "en" ? "English" : "英文"}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleLocaleChange("zh")}>
            {currentLocale === "en" ? "Simplified Chinese" : "中文"}
          </Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Button
        theme="borderless"
        icon={<IconLanguage size="large" />}
        style={{ color: "var(--semi-color-text-2)" }}
      >
        {currentLocale.toUpperCase()} {/* 显示当前语言 */}
      </Button>
    </Dropdown>
  );
}
