"use client";

import {
  Dropdown,
  Avatar,
  Button,
  Layout,
  Tag,
  Space,
} from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
  IconMoon,
  IconSun,
  IconVerify,
} from "@douyinfe/semi-icons";
import React, { useState } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import LocaleSwitcher from "../../components/locale-switcher";
import { useHeaderStore } from "@/store/header";

const ClientHeader = ({
  loginButton,
  shop,
  order,
  doc,
  manageUser,
  lagout,
  local,
}: {
  loginButton: string;
  shop: string;
  order: string;
  doc: string;
  manageUser: string;
  lagout: string;
  local: string;
}) => {
  const { data } = useSession();

  const user = useHeaderStore((state: any) => state.user) || data?.user;
  const removeUser = useHeaderStore((state: any) => state.removeUser);
  const pathname = usePathname();
  const router = useRouter();
  const { Header } = Layout;

  const isLoginPage =
    pathname.includes("/login") || pathname.includes("/register");
  const [isMoon, setIsMoon] = useState(true);
  const [selectedKey, setSelectedKey] = useState("shop");

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
    { key: "order", label: order, path: `/${local}/dashboard/order` },
    { key: "doc", label: doc, path: `/${local}/doc` },
  ];

  const handleClick = (key: string, path: string) => {
    setSelectedKey(key);
    router.push(path);
  };

  if (isLoginPage) return null;

  const userDropdown = (
    <div
      style={{
        padding: "16px",
        width: "auto",
        background: "var(--semi-color-bg-1)",
        borderRadius: "4px",
        boxShadow: "var(--semi-shadow-elevated)",
      }}
    >
      {/* 用户信息部分 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <Avatar
          src={user?.image || "/favicon.ico"}
          alt="User Avatar"
          style={{
            width: "40px",
            height: "40px",
            marginRight: "12px",
          }}
        />
        <div>
          <div style={{ fontWeight: 600 }}>
            <Space>
              {user?.email || ""}
              <Tag
                color="light-blue"
                prefixIcon={<IconVerify />}
                size="large"
                shape="circle"
                type="solid"
              >
                {user?.role}
              </Tag>
            </Space>
          </div>
        </div>
      </div>
      {/* 操作按钮 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <Button
          theme="light"
          style={{ flex: 1 }}
          onClick={() => router.push(`/${local}/profile`)}
        >
          {manageUser}
        </Button>
        <Button
          theme="light"
          style={{ flex: 1 }}
          onClick={() => {
            removeUser();
            signOut();
            redirect("/login");
          }}
        >
          {lagout}
        </Button>
      </div>
    </div>
  );

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

        {/* 中间导航 */}
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

        {/* 右侧操作 */}
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
            <Dropdown
              trigger="click"
              position="bottomRight"
              render={userDropdown}
            >
              <Avatar
                src={user.image || "/favicon.ico"}
                alt="User Avatar"
                style={{
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  marginRight: "2rem",
                }}
              />
            </Dropdown>
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
