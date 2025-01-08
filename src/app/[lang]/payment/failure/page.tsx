export default function PaymentFailure() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">支付失败</h1>
      <p>支付未完成，请重试。</p>
      <a
        href="/dashboard/addfunds"
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        返回支付页面
      </a>
    </div>
  );
}
