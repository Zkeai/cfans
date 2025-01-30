"use client";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    const submitCreateOrder = async () => {
      await fetch("/api/telegram");
    };
    submitCreateOrder();
  }, []);
  return <div>配置webhook的页面</div>;
};

export default page;
