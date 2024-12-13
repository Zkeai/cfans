// components/ClientHeader.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Nav, Button } from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
  IconBell,
  IconHelpCircle,
  IconMoon,
  IconSun,
} from "@douyinfe/semi-icons";
import LocaleSwitcher from "../../components/locale-switcher";

const ClientHeader = ({
  loginButton,
  shop,
  order,
  doc,
  local,
}: {
  loginButton: string;
  shop: string;
  order: string;
  doc: string;
  local: string;
}) => {
  const router = useRouter();
  const { Header } = Layout;
  const [isMoon, setIsMoon] = useState(true);

  const toggleIcon = () => {
    const body = document.body;
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode");
    } else {
      body.setAttribute("theme-mode", "dark");
    }
    setIsMoon(!isMoon);
  };

  // 导航项配置
  const navItems = [
    { key: "shop", label: shop, path: `/${local}/` },
    { key: "order", label: order, path: `/${local}/order` },
    { key: "doc", label: doc, path: `/${local}/doc` },
  ];

  // 选中状态
  const [selectedKey, setSelectedKey] = useState(navItems[0].key);

  // 点击导航项
  const handleClick = (key: string, path: string) => {
    setSelectedKey(key); // 更新选中状态
    router.push(path); // 跳转页面
  };

  //跳转登陆页面
  const loginHandle = () => {
    router.push("login");
  };

  return (
    <Header
      style={{
        border: "1px solid var(--semi-color-border)",
        height: "8vh",
        backgroundColor: "var(--semi-color-bg-1)",
        display: "flex",
        alignItems: "center", // 确保 Header 内部内容垂直居中
      }}
    >
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          alignItems: "center", // 确保子项内容垂直居中
          width: "100%",
        }}
      >
        {/* 左侧 Logo */}
        <IconSemiLogo
          style={{ height: "36px", fontSize: 36, marginRight: "16px" }}
        />

        {/* 中间导航项 */}
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            gap: "24px",
            justifyContent: "center",
            alignItems: "center", // 确保导航项垂直居中
          }}
        >
          {navItems.map((item) => (
            <span
              key={item.key}
              onClick={() => handleClick(item.key, item.path)}
              style={{
                cursor: "pointer",
                color:
                  selectedKey === item.key
                    ? "var(--semi-color-text-0)"
                    : "var(--semi-color-text-2)",
                fontWeight: selectedKey === item.key ? "600" : "400",
                fontSize: "16px",
              }}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* 右侧操作按钮 */}
        <div
          style={{
            display: "flex",
            alignItems: "center", // 确保按钮垂直居中
            gap: "12px",
          }}
        >
          <Button
            theme="borderless"
            icon={isMoon ? <IconMoon size="large" /> : <IconSun size="large" />}
            style={{ color: "var(--semi-color-text-2)" }}
            onClick={toggleIcon}
          />
          {/* 集成语言切换器 */}
          <LocaleSwitcher />
          <Button
            theme="borderless"
            style={{
              color: "var(--semi-color-bg-4)",
              backgroundColor: "rgba(var(--semi-grey-9), 1)",
              marginRight: "2rem",
            }}
            onClick={() => loginHandle()}
          >
            {loginButton}
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default ClientHeader;
