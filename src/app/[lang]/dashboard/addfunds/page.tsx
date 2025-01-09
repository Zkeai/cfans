"use client";
import {
  Card,
  Typography,
  Space,
  Divider,
  Input,
  Tag,
  Button,
  Toast,
  Table,
  Pagination,
} from "@douyinfe/semi-ui";
import { useState, useEffect } from "react";
import { IconInfoCircle, IconAlertTriangle } from "@douyinfe/semi-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useHeaderStore } from "@/utils/store/header";

const { Title, Text } = Typography;

export default function Home() {
  const [averagePrice, setAveragePrice] = useState(7.52); // 汇率
  const router = useRouter();
  const [rmbValue, setRmbValue] = useState("");
  const [usdtValue, setUsdtValue] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data } = useSession();
  const user = useHeaderStore((state: any) => state.user) || data?.user;
  const id = user?.id;

  useEffect(() => {
    async function fetchAveragePrice() {
      try {
        const response = await fetch("/api/okx/getAveragePrice");
        if (!response.ok) {
          throw new Error(`Failed to fetch average price: ${response.status}`);
        }
        const result = await response.json();
        setAveragePrice(result.averagePrice.toFixed(2)); // 设置实时汇率
      } catch (error) {}
    }
    async function getOrderList() {
      try {
        const res = await fetch("/api/rechargeOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: id,
          }),
        });
        const data = await res.json();
        setOrderList(data.orders || []);
      } catch (error) {}
    }
    getOrderList();
    fetchAveragePrice();
  }, [id]);

  const renderStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      success: "订单完成",
      failed: "订单失败",
      expired: "订单过期",
      pending: "等待完成",
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
      title: "状态",
      dataIndex: "status",
      render: (status: string) => renderStatus(status),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "金额 (USDT)",
      dataIndex: "amount",
    },
  ];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when page size changes
  };
  // 处理 RMB 输入变化
  const handleRmbChange = (value: any) => {
    const numericValue = parseFloat(value); // 将输入转换为数字
    if (numericValue <= 0 || isNaN(numericValue)) {
      setRmbValue("");
      setUsdtValue("");
      return;
    }

    setRmbValue(value);
    if (averagePrice) {
      setUsdtValue((numericValue / averagePrice).toFixed(2));
    }
  };

  // 处理 USDT 输入变化
  const handleUsdtChange = (value: any) => {
    const numericValue = parseFloat(value); // 将输入转换为数字
    if (numericValue <= 0 || isNaN(numericValue)) {
      setUsdtValue("");
      setRmbValue("");
      return;
    }

    setUsdtValue(value);
    if (averagePrice) {
      setRmbValue((numericValue * averagePrice).toFixed(2));
    }
  };

  const submitTrance = async () => {
    if (!usdtValue) {
      Toast.error("请确认充值金额");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        address: "0x0000000000000000000000000000000000000000",
        amount: usdtValue,
        cnyAmount: rmbValue,
      }),
    });

    const { orderId } = await res.json();

    if (!orderId) {
      Toast.error("订单创建失败");
      return;
    }

    router.push(`/payment/${orderId}`);
  };

  return (
    <div className="gap-6 p-6">
      {/* 充值说明 Card */}
      <Card
        style={{
          backgroundColor: "var(--semi-color-shadow)",
          padding: "16px",
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: "16px" }}
        title={
          <Space>
            <IconAlertTriangle style={{ color: "#f09357", fontSize: "20px" }} />
            <Title heading={5}>
              <Text type="warning" strong>
                充值说明
              </Text>
            </Title>
          </Space>
        }
      >
        <Space vertical align="start" spacing="medium">
          <Text>
            <Tag color="orange" style={{ marginRight: "8px" }}>
              <Text type="danger" strong>
                重要
              </Text>
            </Tag>
            <Text type="success">
              先决定充值多少{" "}
              <Text type="warning" strong>
                RMB
              </Text>
              ，再根据网站要求的加密货币数量转账。
            </Text>
          </Text>
          <Divider margin="12px 0" />
          <Text type="success" strong>
            不要自行决定发送多少 USDT，网站不会为你多付的加密货币而转化成余额。
          </Text>
          <Divider margin="12px 0" />
          <Text type="success">
            转账{" "}
            <Text strong type="warning">
              手续费自付
            </Text>
            ，不要忽略小数点后的数，到账数{" "}
            <Text strong type="warning">
              不能少于
            </Text>{" "}
            网站要求数量。
          </Text>
          <Divider margin="12px 0" />
          <Text type="warning" strong>
            仔细核对转账的链以及币种，
            <Text strong type="warning">
              转错链无法正常到账
            </Text>
            ，需自行承担损失。
          </Text>
          <Divider margin="12px 0" />
          <Text type="success">
            <Text strong type="warning">
              充值转账时间有限
            </Text>
            ，需在网站提示的时间内到账。
            <br />
            超时到账不会自动充值，需联系人工处理。
          </Text>
        </Space>
      </Card>
      <br />
      {/* 汇率转换 Card */}
      <Card
        style={{
          borderRadius: "8px",
        }}
        title={
          <Space>
            <IconInfoCircle style={{ color: "#3b5998", fontSize: "20px" }} />
            <Title heading={5} style={{ margin: 0 }}>
              充值
            </Title>
          </Space>
        }
        bodyStyle={{ padding: "16px" }}
      >
        <Space
          vertical
          align="start"
          spacing="medium"
          style={{ width: "100%" }}
        >
          <Space align="center" style={{ width: "100%" }}>
            <Input
              prefix="RMB"
              value={rmbValue}
              onChange={(value) => handleRmbChange(value)}
              style={{ flex: 1 }}
              placeholder="输入人民币金额"
            />
            <Text strong style={{ margin: "0 8px" }}>
              ↔
            </Text>
            <Input
              prefix="USDT"
              value={usdtValue}
              onChange={(value) => handleUsdtChange(value)}
              style={{ flex: 1 }}
              placeholder="输入USDT金额"
            />
          </Space>

          <Button block theme="solid" type="primary" onClick={submitTrance}>
            充值
          </Button>
        </Space>
      </Card>
      <br />
      {/* 历史订单 orderList */}
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
          dataSource={orderList.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )} // 分页数据
          pagination={false} // Disable Table's built-in pagination
          rowKey="_id"
        />
        <Pagination
          total={orderList.length}
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
}
