"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHeaderStore } from "@/utils/store/header";
import {
  Card,
  Typography,
  Spin,
  Notification,
  Progress,
  Select,
  Button,
} from "@douyinfe/semi-ui";
import { IconCopy } from "@douyinfe/semi-icons";
import { QRCodeSVG } from "qrcode.react";
import { useSession } from "next-auth/react";

type Order = {
  id: string;
  address: string;
  amount: string;
  status: string;
};

type Config = {
  address: string;
  chain: string;
};

export default function PaymentPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60 * 6); // 60分钟倒计时
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [addressConfig, setAddressConfig] = useState<Config | null>(null);
  const { data } = useSession();

  const user = useHeaderStore((state: any) => state.user) || data?.user;

  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const chains = [
    { value: "ethereum", label: "Ethereum" },
    { value: "bsc", label: "Binance Smart Chain" },
  ];

  const currencies = [{ value: "usdt", label: "USDT" }];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addressConfigs: { [key: string]: Config } = {
    "ethereum-usdt": {
      address: "0x342a233df1c874f8389fec95a3db04f37694adcc",
      chain: "Ethereum",
    },

    "bsc-usdt": {
      address: "0x342a233df1c874f8389fec95a3db04f37694adcc",
      chain: "Binance Smart Chain",
    },
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) throw new Error("无法获取订单详情");

        const data = await response.json();
        setOrder(data);
        setStatus(data.status);
      } catch (err: any) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (status === "success") {
      const changeCny = async () => {
        const res = await fetch("/api/cny", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
          }),
        });
        const data = await res.json();

        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            operation: "add",
            amount: data.cnyAmount,
          }),
        });
      };
      changeCny();
      return;
    }

    if (status !== "pending" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status, orderId, user?.id]);

  useEffect(() => {
    if (status !== "pending") return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        if (!response.ok) throw new Error("状态检查失败");

        const data = await response.json();
        setStatus(data.status);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [status, orderId]);

  useEffect(() => {
    if (selectedChain && selectedCurrency) {
      const key = `${selectedChain}-${selectedCurrency}`;
      setAddressConfig(addressConfigs[key] || null);
    }
  }, [addressConfigs, selectedChain, selectedCurrency]);

  useEffect(() => {
    const changeAddress = async () => {
      if (addressConfig?.address && orderId) {
        // 确保 addressConfig 有值且 orderId 存在
        try {
          const res = await fetch("/api/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: orderId,
              address: addressConfig.address,
            }),
          });

          if (!res.ok) {
            throw new Error("更新地址失败");
          }
          await res.json();
        } catch (error) {
          console.error("Error updating address:", error);
        }
      }
    };

    changeAddress();
    // 添加条件依赖，防止多次调用
  }, [addressConfig?.address, orderId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const copyToClipboard = () => {
    if (addressConfig?.address) {
      navigator.clipboard.writeText(addressConfig.address);
      Notification.success({ content: "地址已复制到剪贴板", duration: 3 });
    }
  };

  if (loading) return <Spin tip="加载中..." />;
  if (error) return <div>出错了：{error}</div>;

  const progressPercent = ((60 * 60 - timeLeft) / (60 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card
        title="支付订单"
        style={{ width: 600 }}
        headerLine={true}
        bodyStyle={{ padding: 24 }}
      >
        {/* 倒计时和进度条 */}
        <div className="flex items-center mb-8">
          <div style={{ flex: "0 0 120px", textAlign: "center" }}>
            <Progress
              percent={progressPercent}
              type="circle"
              size="large"
              format={() => ""}
              stroke="var(--semi-color-primary)"
            />
          </div>
          <div style={{ marginLeft: 24, flex: 1 }}>
            <Typography.Text strong>支付倒计时：</Typography.Text>
            <Typography.Title heading={4}>
              {formatTime(timeLeft)}
            </Typography.Title>
            <Typography.Text type="secondary">
              {status === "pending"
                ? "请在规定时间内完成订单。"
                : status === "success"
                ? "订单已完成"
                : "订单已过期。"}
            </Typography.Text>
          </div>
        </div>

        {/* 链和币种选择 */}
        <div style={{ marginBottom: 16 }}>
          <Select
            placeholder="选择链"
            style={{ width: "100%", marginBottom: 12 }}
            onChange={(value: any) => setSelectedChain(value)}
            optionList={chains}
          />
          <Select
            placeholder="选择币种"
            style={{ width: "100%" }}
            onChange={(value: any) => setSelectedCurrency(value)}
            optionList={currencies}
          />
        </div>

        {/* 二维码和支付信息 */}
        {addressConfig && (
          <div className="flex items-center">
            <div style={{ flex: "0 0 150px", textAlign: "center" }}>
              <QRCodeSVG value={addressConfig.address} size={150} />
            </div>
            <div style={{ marginLeft: 24, flex: 1 }}>
              <Typography.Title heading={5}>收款地址：</Typography.Title>
              <div className="flex items-center">
                <Typography.Text strong>
                  {addressConfig.address}
                </Typography.Text>
                <Button
                  icon={<IconCopy />}
                  style={{ marginLeft: 8 }}
                  onClick={copyToClipboard}
                />
              </div>

              <Typography.Title heading={5} style={{ marginTop: 16 }}>
                支付金额：
              </Typography.Title>
              <Typography.Text strong>
                {order?.amount || "--"} USDT
              </Typography.Text>

              <Typography.Title heading={5} style={{ marginTop: 16 }}>
                支付状态：
              </Typography.Title>
              <Typography.Text
                type={status === "pending" ? "warning" : "danger"}
                strong
              >
                {status === "pending"
                  ? "等待支付"
                  : status === "success"
                  ? "支付成功"
                  : "支付过期"}
              </Typography.Text>
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        {(status === "expired" ||
          status === "failed" ||
          status === "success") && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Button
              type="primary"
              onClick={() => router.push("/dashboard/addfunds")}
            >
              返回支付页
            </Button>
          </div>
        )}

        {orderId && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <Typography.Text type="secondary">
              订单 ID: {orderId}
            </Typography.Text>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Typography.Text type="tertiary" strong>
            Powered by CFans
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
}
