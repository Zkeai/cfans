export default function PaymentExpired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-center">
      <h1 className="text-2xl font-bold text-yellow-500 mb-4">支付已过期</h1>
      <p>请重新发起支付。</p>
      <a
        href="/dashboard/addfunds"
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        返回支付页面
      </a>
    </div>
  );
}
