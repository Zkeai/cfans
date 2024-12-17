"use client";

import dynamic from "next/dynamic";
import React from "react";

// 动态导入 Spin 组件
const Spin = dynamic(
  (): any => import("@douyinfe/semi-ui").then((mod) => mod.Spin),
  {
    ssr: false,
  }
);

const Loading: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
