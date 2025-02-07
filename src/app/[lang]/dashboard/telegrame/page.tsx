"use client"; // 确保它只在客户端运行

import React, { useEffect, useState } from "react";
import { Space, Switch, Notification } from "@douyinfe/semi-ui";

const Telegrame = () => {
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false); // 用于防止 SSR 运行 useEffect

  useEffect(() => {
    setMounted(true); // 只在客户端执行
  }, []);

  useEffect(() => {
    if (!mounted) return; // 防止 SSR 执行 useEffect
    const getBotStatus = async () => {
      try {
        const res = await fetch("/api/getTelegrameStatus");
        if (!res.ok) {
          throw new Error("请求失败");
        }
        const data = await res.json();
        if (data.result === "查询成功" && data.data?.length > 0) {
          setChecked(data.data[0].isOpen);
        }
      } catch (error) {
        console.error("获取 TG 状态失败:", error);
      }
    };

    getBotStatus();
  }, [mounted]);

  const onChange = async (checked: boolean) => {
    if (!mounted) return;
    try {
      if (checked) {
        const res = await fetch("/api/telegram");
        if (!res.ok) throw new Error("TG 连接失败");
      }

      const response = await fetch("/api/setTelegrameStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: checked }),
      });

      const data = await response.json();

      if (data.result === "创建成功" || data.result === "更新成功") {
        Notification.success({
          title: "TGBOT",
          content: `更新成功`,
        });
        setChecked(checked); // 只有成功后才更新状态
      } else {
        throw new Error("更新失败");
      }
    } catch (error) {
      Notification.error({
        title: "状态",
        content: `操作失败: ${error}`,
      });
    }
  };

  if (!mounted) return null; // 避免 SSR 时报错

  return (
    <div className="gap-6 p-6">
      <Space>
        <span>初始化TGBot</span>
        <Switch
          checked={checked}
          checkedText="开"
          uncheckedText="关"
          onChange={onChange}
        />
      </Space>
    </div>
  );
};

export default Telegrame;
