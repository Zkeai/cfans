"use client";

import React, { useEffect, useState } from "react";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { signIn } from "@/lib/auth";
import { login } from "@/action/user";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState(""); // 错误状态
  const [loading, setLoading] = useState(false); // 加载状态

  // 检查用户是否已经登录
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        router.push("/"); // 已登录跳转首页
      }
    };
    checkSession();
  }, [router]);

  // 处理 OAuth 登录
  const handleOAuthSignIn = async (provider: string) => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn(provider, { redirect: false });
      if (!result?.error) {
        router.push("/"); // 登录成功
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (err) {
      setError("Something went wrong during sign in.");
    } finally {
      setLoading(false);
    }
  };

  // 处理表单登录
  const handleCredentialsSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await login(formData);

      if (!result?.error) {
        router.push("/"); // 登录成功
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-100">
      {/* 背景 */}
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* 登录表单 */}
      <div className="relative bg-white shadow-xl rounded-xl p-8 max-w-sm w-full">
        <h3 className="text-lg font-extrabold text-center mb-4">
          Sign in to Cfans
        </h3>
        <p className="text-sm text-center mb-4 text-gray-500">
          Welcome back! Please sign in to continue
        </p>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {["github", "twitter", "google"].map((provider) => (
            <button
              key={provider}
              onClick={() => handleOAuthSignIn(provider)}
              className="flex-grow flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-500 h-[40px] rounded-md hover:bg-gray-100 transition"
              disabled={loading}
            >
              {provider === "github" && <IconBrandGithub size={18} />}
              {provider === "twitter" && <IconBrandTwitter size={18} />}
              {provider === "google" && <IconBrandGoogle size={18} />}
              <span className="text-sm capitalize">{provider}</span>
            </button>
          ))}
        </div>

        {/* 分隔线 */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* 表单登录 */}
        <form onSubmit={handleCredentialsSignIn}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-violet-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
