"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Nav, Button } from "@douyinfe/semi-ui";
import { IconSemiLogo, IconBell, IconHelpCircle } from "@douyinfe/semi-icons";

const ClientHeader = () => {
  const router = useRouter();
  const { Header } = Layout;

  // 导航项配置
  const navItems = [
    { key: "index", label: "商店首页", path: "/" },
    { key: "search", label: "查询订单", path: "/search" },
    { key: "doc", label: "使用教程", path: "/doc" },
  ];

  // 选中状态
  const [selectedKey, setSelectedKey] = useState(navItems[0].key);

  // 点击导航项
  const handleClick = (key: string, path: string) => {
    setSelectedKey(key); // 更新选中状态
    router.push(path); // 跳转页面
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
            icon={<IconBell size="large" />}
            style={{ color: "var(--semi-color-text-2)" }}
          />
          <Button
            theme="borderless"
            icon={<IconHelpCircle size="large" />}
            style={{ color: "var(--semi-color-text-2)" }}
          />
        </div>
      </div>
    </Header>
  );
};

export default ClientHeader;
