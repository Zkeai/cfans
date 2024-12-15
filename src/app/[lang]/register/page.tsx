import React from "react";

import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { register } from "@/action/user";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/getSession";

const Register = async () => {
  const session = await getSession();
  const user = session?.user;
  if (user) redirect("/");

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
            <form
              action={async () => {
                "use server";
                await signIn(provider);
              }}
              key={provider}
              className="flex justify-center"
            >
              <button
                type="submit"
                className="flex-grow flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-500 h-[40px] rounded-md hover:bg-gray-100 transition"
              >
                {provider === "github" && <IconBrandGithub size={18} />}
                {provider === "twitter" && <IconBrandTwitter size={18} />}
                {provider === "google" && <IconBrandGoogle size={18} />}
                <span className="text-sm capitalize">{provider}</span>
              </button>
            </form>
          ))}
        </div>
        {/* 使用带样式的横线 */}
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <form action={register}>
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
