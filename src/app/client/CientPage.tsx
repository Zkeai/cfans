"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Nav,
  Button,
  Breadcrumb,
  Skeleton,
  Avatar,
} from "@douyinfe/semi-ui";
import {
  IconSemiLogo,
  IconBell,
  IconHelpCircle,
  IconBytedanceLogo,
  IconHome,
  IconHistogram,
  IconLive,
  IconSetting,
} from "@douyinfe/semi-icons";

const ClientComponent = () => {
  const router = useRouter();
  const { Sider, Content } = Layout;

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
            items={[
              {
                itemKey: "Home",
                text: "首页",
                icon: <IconHome size="large" />,
              },
              {
                itemKey: "Histogram",
                text: "基础数据",
                icon: <IconHistogram size="large" />,
              },
              {
                itemKey: "Live",
                text: "测试功能",
                icon: <IconLive size="large" />,
              },
              {
                itemKey: "Setting",
                text: "设置",
                icon: <IconSetting size="large" />,
              },
            ]}
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
            routes={[
              "首页",
              "当这个页面标题很长时需要省略",
              "上一页",
              "详情页",
            ]}
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
