// components/ClientHeader.tsx
"use client";
// components/ClientHeader.tsx
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Button, Avatar } from "@douyinfe/semi-ui"; // 导入 Avatar
import { signIn } from "next-auth/react";

import { IconSemiLogo, IconMoon, IconSun } from "@douyinfe/semi-icons";
import LocaleSwitcher from "../../components/locale-switcher";
import { getSession } from "next-auth/react";

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
  const [user, setUser] = useState<any>(null); // 设置类型为 any，便于访问用户数据
  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      setUser(session?.user as any);
    };
    getUser();
  }, []);

  const pathname = usePathname();
  const isLoginPage =
    pathname.includes("/login") || pathname.includes("/register");

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

  const navItems = [
    { key: "shop", label: shop, path: `/${local}/` },
    { key: "order", label: order, path: `/${local}/order` },
    { key: "doc", label: doc, path: `/${local}/doc` },
  ];

  const [selectedKey, setSelectedKey] = useState(navItems[0].key);

  const handleClick = (key: string, path: string) => {
    setSelectedKey(key);
    router.push(path);
  };
  if (isLoginPage) return null;

  return (
    <Header
      style={{
        border: "1px solid var(--semi-color-border)",
        height: "8vh",
        backgroundColor: "var(--semi-color-bg-1)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
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
            alignItems: "center",
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
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Button
            theme="borderless"
            icon={isMoon ? <IconMoon size="large" /> : <IconSun size="large" />}
            style={{ color: "var(--semi-color-text-2)" }}
            onClick={toggleIcon}
          />
          <LocaleSwitcher />
          {user ? (
            <Avatar
              src={user.image || "/favicon.ico"} // 使用用户头像或默认头像
              alt="User Avatar"
              style={{
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
              }}
              onClick={() => router.push(`/${local}/profile`)} // 点击头像跳转到个人中心
            />
          ) : (
            <Button
              theme="borderless"
              style={{
                color: "var(--semi-color-bg-4)",
                backgroundColor: "rgba(var(--semi-grey-9), 1)",
                marginRight: "2rem",
              }}
              onClick={() => signIn()}
            >
              {loginButton}
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};

export default ClientHeader;
