"use client";

import React from "react";
import { Layout, Nav, Breadcrumb, Skeleton } from "@douyinfe/semi-ui";
import {
  IconCart,
  IconCreditCard,
  IconShoppingBag,
} from "@douyinfe/semi-icons";
import { useRouter } from "next/navigation"; // Next.js 路由 hook

const ClientComponent = () => {
  const { Sider, Content } = Layout;
  const router = useRouter();

  // 定义路由和菜单信息
  const routes = [
    {
      key: "Home",
      text: "创建新订单",
      icon: <IconCart size="large" />,
      path: "/home",
    },
    {
      key: "Recharge",
      text: "余额充值",
      icon: <IconCreditCard size="large" />,
      path: "/recharge",
    },
    {
      key: "Orders",
      text: "我的订单",
      icon: <IconShoppingBag size="large" />,
      path: "/orders",
    },
  ];

  // 处理菜单点击
  const handleNavSelect = (data: { itemKey: string }) => {
    const selectedRoute = routes.find((route) => route.key === data.itemKey);
    if (selectedRoute) {
      router.push(selectedRoute.path); // 跳转到对应路径
    }
  };

  return (
    <Layout
      style={{
        border: "1px solid var(--semi-color-border)",
        height: "85vh",
      }}
    >
      <Layout
        style={{
          height: "80%", // 占屏幕 80%
          overflow: "auto",
        }}
      >
        <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
          <Nav
            style={{ maxWidth: 220, height: "100%" }}
            defaultSelectedKeys={["Home"]}
            items={routes.map((route) => ({
              itemKey: route.key,
              text: route.text,
              icon: route.icon,
            }))}
            onSelect={handleNavSelect} // 绑定点击事件
            footer={{
              collapseButton: true,
            }}
          />
        </Sider>
        <Content
          style={{
            padding: "24px",
            backgroundColor: "var(--semi-color-bg-0)",
          }}
        >
          <Breadcrumb
            style={{
              marginBottom: "24px",
            }}
            routes={["首页", "某页", "详情页"]}
          />
          <div
            style={{
              borderRadius: "10px",
              border: "1px solid var(--semi-color-border)",
              height: "100%",
              padding: "32px",
            }}
          >
            <Skeleton
              placeholder={<Skeleton.Paragraph rows={2} />}
              loading={true}
            >
              <p>Hi, Bytedance dance dance.</p>
              <p>Hi, Bytedance dance dance.</p>
            </Skeleton>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientComponent;
