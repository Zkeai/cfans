"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Button,
  Empty,
  Typography,
  Select,
  InputNumber,
  Notification,
} from "@douyinfe/semi-ui";
import { IconDelete, IconUser, IconMail } from "@douyinfe/semi-icons";
import {
  IllustrationNoResult,
  IllustrationNoResultDark,
} from "@douyinfe/semi-illustrations";

const { Text } = Typography;

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  image?: string;
  balance: number;
};

type ApiResponse = {
  data: User[];
};

function UserTable() {
  const [dataSource, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState<number>(5);
  const [editingRow, setEditingRow] = useState<{
    id: string;
    value: number;
  } | null>(null);

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const res = await fetch("/api/rechargeUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data: ApiResponse = await res.json();

        if (Array.isArray(data.data)) {
          setData(data.data);
        } else {
          console.error("API 返回的数据不是数组:", data);
          setData([]);
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getUsersList();
  }, []);

  const updateUserData = async (id: string, field: string, value: any) => {
    try {
      const res = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, field, value }),
      });

      const result = await res.json();
      if (result.success) {
        Notification.success({
          title: "更新成功",
          content: `用户 ${field === "role" ? "角色" : "余额"} 已更新`,
        });

        // ✅ 更新表格数据
        setData((prevData) =>
          prevData.map((user) =>
            user._id === id ? { ...user, [field]: value } : user
          )
        );
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Notification.error({
        title: "更新失败",
        content: `无法更新 ${field}`,
      });
      console.error("更新用户数据失败:", error);
    }
  };

  const handleRoleChange = (_id: string, newRole: "admin" | "user") => {
    setData((prevData) =>
      prevData.map((user) =>
        user._id === _id ? { ...user, role: newRole } : user
      )
    );
    updateUserData(_id, "role", newRole);
  };

  const removeRecord = async (_id: string) => {
    try {
      const res = await fetch("/api/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });

      const result = await res.json();
      if (result.success) {
        setData((prevData) => prevData.filter((item) => item._id !== _id));
        Notification.success({
          title: "删除成功",
          content: `用户已删除`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      Notification.error({
        title: "删除失败",
        content: `无法删除用户`,
      });
      console.error("删除用户失败:", error);
    }
  };

  const columns = [
    {
      title: "用户",
      dataIndex: "name",
      render: (text: string, record: User) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Avatar size="small" src={record.image} style={{ marginRight: 12 }}>
            {!record.image && <IconUser />}
          </Avatar>
          <Text>{text}</Text>
        </span>
      ),
    },
    {
      title: "用户ID",
      dataIndex: "_id",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      render: (text: string) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          <IconMail style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: "角色",
      dataIndex: "role",
      filters: [
        { text: "管理员", value: "admin" },
        { text: "用户", value: "user" },
      ],
      onFilter: (value: string, record: any) => record.role === value, // Adjusted the condition to check for exact match
      render: (text: "admin" | "user", record: User) => (
        <Select
          value={text}
          onChange={(value: any) => handleRoleChange(record._id, value)}
          style={{ width: 100 }}
        >
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">用户</Select.Option>
        </Select>
      ),
    },
    {
      title: "余额",
      dataIndex: "balance",
      sorter: (a: User | undefined, b: User) => {
        if (!a || !b) return 0;
        return a.balance - b.balance;
      },
      render: (text: number, record: User) => {
        return editingRow?.id === record._id ? (
          <InputNumber
            autoFocus
            value={editingRow.value}
            onChange={(value: any) =>
              value !== undefined && setEditingRow({ id: record._id, value })
            }
            onBlur={() => {
              setEditingRow(null);
              if (editingRow.value !== record.balance) {
                updateUserData(record._id, "balance", editingRow.value);
              }
            }}
            onEnterPress={() => {
              setEditingRow(null);
              if (editingRow.value !== record.balance) {
                updateUserData(record._id, "balance", editingRow.value);
              }
            }}
            min={0}
            precision={2}
            style={{ width: 120 }}
          />
        ) : (
          <Text
            onDoubleClick={() =>
              setEditingRow({ id: record._id, value: record.balance })
            }
            style={{ cursor: "pointer" }}
          >
            {text.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operate",
      render: (_: any, record: User) => (
        <Button
          icon={<IconDelete />}
          theme="borderless"
          onClick={() => removeRecord(record._id)}
        />
      ),
    },
  ];

  const empty = (
    <Empty
      image={<IllustrationNoResult />}
      darkModeImage={<IllustrationNoResultDark />}
      description={"暂无数据"}
    />
  );

  return (
    <div className="gap-6 p-6">
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOpts: [5, 10, 20, 50, 100],
          onPageSizeChange: (size) => setPageSize(size),
        }}
        empty={empty}
      />
    </div>
  );
}

export default UserTable;
