"use client";

import React, { useState } from "react";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react"; // 客户端的 signIn 方法
import { register } from "@/action/user"; // 假设这个是一个客户端调用方法
import { redirect } from "next/navigation";

const Register = () => {
  const { data } = useSession();
  if (data?.user) {
    redirect("/");
  }
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (err) {
      setError("OAuth Sign-In failed. Please try again.");
      console.error("OAuth Sign-In Error:", err);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await register(formData);
      if (!response.success) {
        setError(response.message || "Registration failed.");
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError("Error during registration. Please try again.");
      console.error("Registration Error:", err.message);
    }
  };

  return (
    <div className="relative h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="absolute w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative bg-white shadow-xl rounded-xl p-8 max-w-sm w-full">
        <h3 className="text-md font-extrabold text-center mb-4">
          Create your account
        </h3>
        <p className="text-sm text-center mb-4 text-gray-500">
          Welcome! Please fill in the details to get started.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {["github", "twitter", "google"].map((provider) => (
            <button
              key={provider}
              onClick={() => handleOAuthSignIn(provider)}
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

        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
        )}

        <form onSubmit={handleRegister}>
          <div className="flex gap-4 mb-6 ">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstname"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 `}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastname"
              >
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 `}
              />
            </div>
          </div>
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
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 `}
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
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 `}
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
          Already have an account?{" "}
          <a href="/login" className="text-violet-500 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
