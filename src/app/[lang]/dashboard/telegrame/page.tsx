"use client";

import React, { useEffect, useState } from "react";
import {
  Space,
  Switch,
  Notification,
  Input,
  Button,
  Table,
  Card,
  Divider,
} from "@douyinfe/semi-ui";

const Telegrame = () => {
  const [checked, setChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [telegrameId, setTelegrameId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [adminList, setAdminList] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const getBotStatus = async () => {
      try {
        const res = await fetch("/api/getTelegrameStatus");
        if (!res.ok) throw new Error("请求失败");
        const data = await res.json();
        if (data.result === "查询成功" && data.data?.length > 0) {
          setChecked(data.data[0].isOpen);
          setTelegrameId(data.data[0]._id);
          setAdminList(data.data[0].admin);
        }
      } catch (error) {
        console.error("获取 TG 状态失败:", error);
      }
    };
    getBotStatus();
  }, [mounted]);

  const addAdmin = async () => {
    if (!adminId.trim()) return;
    if (adminList.includes(adminId)) {
      Notification.warning({ title: "警告", content: "管理员 ID 已存在" });
      return;
    }
    setAdminList([...adminList, adminId]);

    const response = await fetch("/api/addTelegrameAdminId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegrameId: telegrameId, id: adminId }),
    });
    const data = await response.json();
    if (data.result === "添加成功") {
      Notification.success({ title: "通知", content: "添加管理员成功" });
    } else {
      Notification.error({ title: "通知", content: "添加管理员失败" });
    }
    setAdminId("");
  };

  const removeAdmin = async (id: string) => {
    setAdminList(adminList.filter((admin) => admin !== id));
    const response = await fetch("/api/deleteTelegrameAdminId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telegrameId: telegrameId, id: id }),
    });
    const data = await response.json();
    if (data.result === "删除成功") {
      Notification.success({ title: "通知", content: `已删除管理员 ${id}` });
    } else {
      Notification.error({ title: "通知", content: "删除管理员失败" });
    }
  };

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
          content: "更新成功",
        });
        setChecked(checked);
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
    <div className="p-6 px-52 max-w-6xl">
      {/* 机器人状态管理 */}
      <Card title="TGBot 状态管理" className="mb-6">
        <Space align="center">
          <span>初始化 TGBot：</span>
          <Switch
            checked={checked}
            checkedText="开"
            uncheckedText="关"
            onChange={onChange}
          />
        </Space>
      </Card>

      {/* 分割线 */}
      <Divider />

      {/* 管理员管理 */}
      <Card title="管理员管理">
        <Space style={{ width: "100%" }} vertical>
          {/* 添加管理员 */}
          <Space style={{ width: "100%" }}>
            <Input
              value={adminId}
              onChange={setAdminId}
              placeholder="输入管理员ID"
              style={{ flex: 1 }}
            />
            <Button theme="solid" type="primary" onClick={addAdmin}>
              添加管理员
            </Button>
          </Space>

          {/* 管理员列表 */}
          <Table
            columns={[
              { title: "管理员 ID", dataIndex: "id", width: "70%" },
              {
                title: "操作",
                width: "30%",
                render: (text, record) => (
                  <Button type="danger" onClick={() => removeAdmin(record.id)}>
                    删除
                  </Button>
                ),
              },
            ]}
            dataSource={adminList.map((id) => ({ id }))}
            bordered
            size="small"
            style={{ marginTop: 20 }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default Telegrame;
