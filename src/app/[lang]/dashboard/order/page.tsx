"use client";
import { Card, Pagination, Space, Table, Typography } from "@douyinfe/semi-ui";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
const { Title } = Typography;
const Order = () => {
  const [shopOrderlist, setShopOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data } = useSession();
  const user = data?.user;
  const id = user?.id;

  useEffect(() => {
    const getShopOrders = async () => {
      const res = await fetch("/api/rechargeShopOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
        }),
      });
      const data = await res.json();
      const orders = data.orders;
      setShopOrderList(orders);
    };
    if (id) getShopOrders();
  }, [id]);

  const renderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "处理中",
      success: "完成",
      stop: "停止",
      reimburse: "退款",
      aftersales: "售后",
    };
    return statusMap[status] || "未知状态";
  };
  const columns = [
    {
      title: "索引",
      dataIndex: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "订单ID",
      dataIndex: "_id",
    },
    {
      title: "链接",
      dataIndex: "url",
    },
    {
      title: "服务",
      dataIndex: "server",
    },

    {
      title: "数量",
      dataIndex: "num",
    },
    {
      title: "金额 (USDT)",
      dataIndex: "amount",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (status: string) => renderStatus(status),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
  ];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when page size changes
  };
  return (
    <div>
      {" "}
      <Card
        title={
          <Space>
            <Title heading={5} style={{ margin: 0 }}>
              历史订单
            </Title>
          </Space>
        }
        bodyStyle={{ padding: "16px" }}
        style={{ borderRadius: "8px", marginTop: "16px" }}
      >
        <Table
          columns={columns}
          dataSource={shopOrderlist.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )} // 分页数据
          pagination={false} // Disable Table's built-in pagination
          rowKey="_id"
        />
        <Pagination
          total={shopOrderlist.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOpts={[5, 10, 20, 50]}
          style={{ marginTop: "16px", textAlign: "right" }}
        />
      </Card>
    </div>
  );
};

export default Order;
