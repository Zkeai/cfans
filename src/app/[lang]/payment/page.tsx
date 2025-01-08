"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PaymentPage() {
  const { data } = useSession();
  const id = data?.user?.id;

  const [address, setAddress] = useState(
    "0x342a233df1c874f8389fec95a3db04f37694adcc"
  );
  const [amount, setAmount] = useState("10");
  const [userId, setUserId] = useState(id);

  const router = useRouter();

  const handlePayment = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, address, amount }),
    });

    const { orderId } = await res.json();

    if (!orderId) {
      alert("订单创建失败");
      return;
    }

    router.push(`/payment/${orderId}`);
  };

  return (
    <div>
      <h1>支付网关 </h1>
      <input
        type="text"
        placeholder="输入userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="输入支付地址"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="支付金额 (USDT)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}> 提交支付 </button>
    </div>
  );
}
