"use client";
import React, { ReactNode, useEffect } from "react";
import "./index.css";
import Nav from "@/components/layout/main/Nav";
import Tab from "@/components/layout/header/Tabs";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type DashboardLayoutProps = {
  children: ReactNode;
};

const Page = ({ children }: DashboardLayoutProps) => {
  const { data, status }: { data: any; status: string } = useSession();

  const router = useRouter();

  useEffect(() => {
    // 确保仅在数据加载完成后检查登录状态

    if (status === "unauthenticated" && !data?.user) {
      router.push("/login");
    }
  }, [data, status, router]);

  return (
    <div className=" flex h-[85vh]">
      <Provider store={store}>
        <Nav></Nav>
        <div className="flex-1 flex flex-col">
          <div className=" flex items-center h-8 w-full shadow-sm">
            <Tab></Tab>
          </div>
          <div className=" body flex-1 overflow-y-auto ">
            <div className=" flex flex-col space-y-8  ">{children}</div>
          </div>
        </div>
      </Provider>
    </div>
  );
};

export default Page;
