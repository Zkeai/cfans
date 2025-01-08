export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center">
      <h1 className="text-2xl font-bold text-green-500 mb-4">支付成功！</h1>
      <p>感谢您的支持！</p>
      <a
        href="/dashboard/addfunds"
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        返回支付页面
      </a>
    </div>
  );
}
