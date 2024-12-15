"use client"; // 将整个组件声明为客户端组件

import React, { useState } from "react";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { useSession, signIn } from "next-auth/react"; // 使用 next-auth/react 的 signIn
import { login } from "@/action/user";
import { redirect } from "next/navigation";

const Login = () => {
  const { data } = useSession();
  if (data?.user) {
    redirect("/");
  }
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 定义错误信息的状态

  const handleSignIn = (provider: string) => {
    setErrorMessage(null); // 清除之前的错误信息
    signIn(provider, { callbackUrl: "/" }).catch((error) => {
      setErrorMessage(`OAuth SignIn Error: ${error.message}`);
    });
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    setErrorMessage(null); // 清除之前的错误信息

    try {
      const response = await login(formData);
      if (!response?.success) {
        setErrorMessage(response?.message || "Invalid email or password.");
      } else {
        window.location.href = "/";
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="relative h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative bg-white shadow-xl rounded-xl p-8 max-w-sm w-full">
        <h3 className="text-md font-extrabold text-center mb-4">
          Sign in to CFans
        </h3>
        <p className="text-sm text-center mb-4 text-gray-500">
          Welcome back! Please sign in to continue
        </p>

        {/* 显示错误信息 */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-sm text-red-700 px-4 py-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          {["github", "twitter", "google"].map((provider) => (
            <button
              key={provider}
              onClick={() => handleSignIn(provider)}
              className="flex-grow flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-500 h-[40px] rounded-md hover:bg-gray-100 transition"
            >
              {provider === "github" && <IconBrandGithub size={18} />}
              {provider === "twitter" && <IconBrandTwitter size={18} />}
              {provider === "google" && <IconBrandGoogle size={18} />}
              <span className="text-sm capitalize">{provider}</span>
            </button>
          ))}
        </div>
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form onSubmit={handleLogin}>
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
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
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
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-200 transition"
          >
            Continue
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
