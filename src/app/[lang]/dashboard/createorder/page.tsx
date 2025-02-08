"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Select,
  Input,
  Button,
  Tag,
  InputNumber,
  Toast,
} from "@douyinfe/semi-ui";
import { getDictionary } from "@/get-dictionary";
import { useTranslationStore } from "@/utils/store/translation";

import "@/app/[lang]/dashboard/index.css";
import { useSession } from "next-auth/react";
// 定义服务数据项的接口
interface ServiceData {
  service: string;
  name: string;
  category: string;
  min: number;
  max: number;
  rate: number;
  context: string;
}

const CreateOrder = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // 搜索框内容
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 选中分类
  const [selectedService, setSelectedService] = useState<string | null>(null); // 选中服务
  const [link, setLink] = useState<string>(""); // 链接
  const [quantity, setQuantity] = useState<number>(0); // 数量
  const [dataSource, setDataSource] = useState([]);
  const [t, setT] = useState<(key: string) => string>(() => (key: any) => key);
  const lang = useTranslationStore((state) => state.lang);

  const { data } = useSession();
  const user = data?.user;
  const id = user?.id;
  const serviceData: ServiceData[] = dataSource;
  // 加载翻译词典
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setT(() => dictionary);
    };

    loadDictionary();
  }, [lang]);

  const getProduct = async () => {
    const data = await fetch("/api/getProduct");
    const productList = await data.json();

    if (productList.success) {
      setDataSource(productList.message);
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  // 获取分类列表
  const categories = useMemo(() => {
    return Array.from(new Set(serviceData.map((item) => item.category)));
  }, [serviceData]);

  // 实时搜索匹配结果
  const filteredServices = useMemo(() => {
    if (!searchTerm) return [];
    return serviceData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, serviceData]);

  // 获取当前选中服务详情
  const selectedServiceDetails = useMemo<ServiceData | undefined>(() => {
    return serviceData.find((item) => item.service === selectedService);
  }, [selectedService, serviceData]);

  // 动态计算价格
  const calculatedPrice = useMemo(() => {
    if (!selectedServiceDetails || quantity === 0) return 0;
    return parseFloat(
      ((selectedServiceDetails.rate / 1000) * quantity).toFixed(2)
    );
  }, [selectedServiceDetails, quantity]);

  //提交订单
  const submitCreateOrder = async () => {
    const res = await fetch("/api/createShopOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedService,
        link,
        quantity,
        calculatedPrice,
        userId: id,
      }),
    });
    const data = await res.json();
    if (data.message === "success") {
      Toast.success("下单成功");
    } else {
      Toast.error(data.message);
    }
  };
  return (
    <div className="container ">
      <title>{lang === "zh" ? "创建新订单" : "CreateOrder"}</title>
      <div className="flex flex-col gap-6 p-6 relative basis-2/3">
        {/* 搜索框 */}
        <div className="relative">
          <Input
            id="search"
            value={searchTerm}
            placeholder={lang === "zh" ? "搜索服务🔍" : "Search service🔍"}
            onChange={(value) => setSearchTerm(value)}
          />

          {/* 匹配结果列表 */}
          {filteredServices.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-10 shadow-lg">
              {filteredServices.map((result) => (
                <div
                  key={result.service}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    setSelectedCategory(result.category);
                    setSelectedService(result.service);
                    setSearchTerm("");
                  }}
                >
                  <span>{result.name}</span>
                  <Tag color="blue">{result.service}</Tag>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分类选择 */}
        <div>
          <label
            htmlFor="category"
            style={{ color: "var( --semi-color-text-1)" }}
            className="block text-sm font-medium mb-2"
          >
            {t("createfenlei")}
          </label>
          <Select
            id="category"
            style={{ width: "100%" }}
            value={selectedCategory as any}
            onChange={(value) => setSelectedCategory(value as any)}
          >
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* 服务选择 */}
        <div>
          <label
            htmlFor="service"
            style={{ color: "var( --semi-color-text-1)" }}
            className="block text-sm font-medium mb-2"
          >
            {t("createfuwu")}
          </label>
          <Select
            id="service"
            style={{ width: "100%" }}
            value={selectedService as any}
            onChange={(value) => setSelectedService(value as any)}
            disabled={!selectedCategory}
          >
            {serviceData
              .filter((item) => item.category === selectedCategory)
              .map((service) => (
                <Select.Option key={service.service} value={service.service}>
                  <div className="flex justify-between items-center">
                    <Tag color="blue">{service.service}</Tag>{" "}
                    <span>{service.name}</span>
                  </div>
                </Select.Option>
              ))}
          </Select>
        </div>

        {/* 链接输入 */}
        <div>
          <label
            style={{ color: "var( --semi-color-text-1)" }}
            htmlFor="link"
            className="block text-sm font-medium mb-2"
          >
            {t("createurl")}
          </label>
          <Input
            id="link"
            placeholder={lang === "zh" ? "请输入链接" : "Please enter link"}
            value={link}
            onChange={(value) => setLink(value)}
          />
        </div>

        {/* 数量输入 */}
        <div>
          <label
            style={{ color: "var( --semi-color-text-1)" }}
            htmlFor="quantity"
            className="block text-sm font-medium mb-2"
          >
            {t("createnum")}
          </label>
          <InputNumber
            id="quantity"
            placeholder="输入数量"
            min={selectedServiceDetails?.min || 0}
            max={selectedServiceDetails?.max || 0}
            value={quantity}
            onChange={(value) => setQuantity(Number(value))}
            disabled={!selectedServiceDetails}
          />
        </div>

        {/* 价格展示 */}
        <div>
          <label
            style={{ color: "var( --semi-color-text-1)" }}
            className="block text-sm font-medium mb-2"
          >
            {t("createprice")}
          </label>
          <Input
            value={calculatedPrice.toFixed(2)}
            disabled
            placeholder="计算价格"
          />
        </div>

        {/* 提交按钮 */}
        <Button
          type="primary"
          onClick={submitCreateOrder}
          disabled={
            !selectedCategory || !selectedService || !link || quantity === 0
          }
        >
          {t("createsubmit")}
        </Button>
      </div>
      <div className=" flex flex-col basis-1/3 gap-6 p-6">
        <div className="basis-1/3">
          <div
            style={{
              backgroundColor: "var(rgba(var(--semi-grey-1), 1))",
              border: "var(rgba(var(--semi-grey-2), 1))",
            }}
            className="  p-4 rounded-lg border text-sm leading-6"
          >
            {/* 标题 */}
            <p
              style={{ color: "var( --semi-color-text-0)" }}
              className="font-semibold  mb-2"
            >
              {lang === "zh"
                ? " 下单前请务必阅读以下内容："
                : "Please be sure to read the following before placing an order:"}
            </p>

            {/* 服务条款和常见问题 */}
            <p className="mb-4" style={{ color: "var( --semi-color-text-1)" }}>
              {lang === "zh"
                ? "请务必阅读我们网站的："
                : "Please be sure to read our website's:"}
              <a
                href={lang === "zh" ? "/zh/term" : "/en/term"}
                target="_blank"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {lang === "zh" ? "服务条款" : "Terms of Service"}
              </a>
              {lang === "zh" ? "和" : "And"}
              <a
                href="/faq"
                target="_blank"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {lang === "zh" ? "常见问题" : "FAQ"}
              </a>
              {lang === "zh"
                ? "相关内容，下单前仔细阅读该服务"
                : "Related content, read the service carefully before placing an order"}
              <span
                style={{ color: "var( --semi-color-text-0)" }}
                className="font-semibold "
              >
                {lang === "zh" ? "描述内容" : "Description content"}
              </span>
              。
              <span className="text-red-500 font-bold">
                {lang === "zh"
                  ? "下单即同意网站规则！"
                  : "By placing an order, you agree to the website rules!"}
              </span>
            </p>

            {/* 注意事项 */}
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li className="flex">
                <span className="text-red-600 font-semibold">❗️</span>{" "}
                <p style={{ color: "var( --semi-color-text-1)" }}>
                  {lang === "zh"
                    ? "下单后无法取消、修改。 若下单链接有效则会完成；无效时不保证100% 退款，请下单前核对清楚自己的链接和需求。"
                    : "The order cannot be canceled or modified after it is placed. If the order link is valid, it will be completed; if it is invalid, 100% refund is not guaranteed. Please check your link and requirements before placing an order."}
                </p>
              </li>
              <li className="flex">
                <span className="text-red-600 font-semibold">❗️</span>{" "}
                <p style={{ color: "var( --semi-color-text-1)" }}>
                  {lang === "zh"
                    ? "所有服务都采用数量计数，仅带售后的按订单范围补充,不按购买总数补。"
                    : "All services are counted by quantity. Only after-sales services are replenished based on the order range, not based on the total number of purchases."}
                </p>
              </li>
              <li className="flex">
                <span className="text-red-600 font-semibold">❗️</span>{" "}
                <p style={{ color: "var( --semi-color-text-1)" }}>
                  {lang === "zh"
                    ? "同一个链接不要同时购买相同类型服务，数量不会叠加且不退款"
                    : "Do not purchase the same type of services from the same link at the same time. The quantities will not be superimposed and no refunds will be given"}
                </p>
              </li>
            </ul>

            {/* 联系方式 */}
            <p className="mb-4" style={{ color: "var( --semi-color-text-0)" }}>
              {lang === "zh" ? "✈️ 联系 TG:" : "✈️ Contact TG:"}

              <a
                href="https://t.me/yobob0208"
                target="_blank"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Chloe
              </a>
              {lang === "zh" ? "｜ TG频道:" : "| TG channel"}

              <a
                href="https://t.me/+E3Q1hMARTfozNjQ1"
                target="_blank"
                className="text-blue-500 underline hover:text-blue-700"
              >
                MuCoin
              </a>
              {lang === "zh" ? "获取最新消息。" : "Get the latest news."}
            </p>

            {/* 提示 */}
            <p className="text-gray-600 italic">
              {lang === "zh"
                ? "非 24 小时在线，请直接说明清楚问题，涉及订单问题请"
                : "Not online 24 hours a day, please explain the problem directly. If you have any questions about orders, "}
              <span className="font-semibold">
                {lang === "zh"
                  ? "一定带上订单 ID"
                  : "Be sure to bring the order ID"}
              </span>
              。
              {lang === "zh"
                ? "（请先阅读相关内容，你的很多问题都能自助解决。）"
                : "(Please read the relevant content first, many of your problems can be solved by yourself.)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
