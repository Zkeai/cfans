"use client";

import React, { useEffect, useState } from "react";
import { Nav, Divider } from "@douyinfe/semi-ui";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addTab,
  changeActiveTab,
  setLanguage,
} from "@/redux/states/headerSlice";
import { useTranslationStore } from "@/utils/store/translation";
import { RootState } from "@/redux/store";
import { useHeaderStore } from "@/utils/store/header";

import {
  IconHome,
  IconShoppingCart,
  IconShoppingBag,
  IconCreditCardPay,
  IconSettings,
} from "@tabler/icons-react";
import { getDictionary } from "@/get-dictionary";
import { useSession } from "next-auth/react";

const NavNode: React.FC = () => {
  const { data } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useHeaderStore((state: any) => state.user) || data?.user;
  const [userInfos, setUserInfos] = useState<any>();
  const [t, setT] = useState<(key: string) => string>(() => (key: any) => key);
  const activeTab = useSelector((state: RootState) => state.header.activeTab);
  const tabsData = useSelector((state: RootState) => state.header.tabsData);

  const lang = useTranslationStore((state) => state.lang);

  // 提取语言前缀
  const langPrefix = lang === "en" ? "/en" : "/zh";

  const handleSelect = (data: any) => {
    const selectedItem = data.selectedItems[0];
    if (!selectedItem || typeof selectedItem.text !== "string") {
      return;
    }

    let path = "";

    // 判断是否点击的是首页
    if (selectedItem.text === t("home")) {
      dispatch(setLanguage(t("home") === "Home" ? "en" : "zh"));

      path = `${langPrefix}/dashboard`;

      // 更新活跃标签到首页
      dispatch(changeActiveTab(selectedItem.text));
      router.push(path); // 直接跳转首页路径
      return; // 无需新增标签，直接返回
    } else {
      // 处理非首页路径
      const itemPath = data.itemKey.startsWith("dashboard/")
        ? data.itemKey.replace("dashboard/", "")
        : data.itemKey;
      path = `${langPrefix}/dashboard/${itemPath}`;
    }

    // 检查标签是否已存在
    const existingTabIndex = tabsData.findIndex((tab) => tab.path === path);
    if (existingTabIndex === -1) {
      // 如果标签不存在，新增标签
      dispatch(addTab({ path, title: selectedItem.text }));
    }

    // 更新活跃标签
    dispatch(changeActiveTab(selectedItem.text));

    // 路由跳转
    router.push(path);
  };

  // 加载翻译词典
  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setT(() => dictionary);
    };

    loadDictionary();
  }, [lang]);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch("/api/userInfo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
          }),
        });
        const data = await res.json();

        if (data?.userInfo) {
          setUserInfos(data.userInfo);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user) getUserInfo();
  }, [user]);

  return (
    <Nav mode="vertical" onSelect={handleSelect} selectedKeys={[activeTab]}>
      <Nav.Item
        itemKey={"dashboard"}
        text={t("home")} // 动态根据语言切换文本
        icon={<IconHome style={{ color: "var(--semi-color-warning)" }} />}
      />
      <Divider
        style={{ marginLeft: "5px", width: "180px" }}
        dashed={true}
        margin="12px"
      />
      <Nav.Item
        itemKey={"createorder"}
        text={t("createOrder")}
        icon={
          <IconShoppingCart style={{ color: "var(--semi-color-warning)" }} />
        }
      />
      <Nav.Item
        itemKey={"order"}
        text={t("myOrder")}
        icon={
          <IconShoppingBag style={{ color: "var(--semi-color-warning)" }} />
        }
      />
      <Nav.Item
        itemKey={"addfunds"}
        text={t("addfunds")}
        icon={
          <IconCreditCardPay style={{ color: "var(--semi-color-warning)" }} />
        }
      />
      <Divider
        style={{ marginLeft: "5px", width: "180px" }}
        dashed={true}
        margin="12px"
      />
      {userInfos?.role === "admin" ? (
        <Nav.Sub
          itemKey={"admin"}
          text={t("admin")}
          icon={
            <IconSettings
              style={{ color: "var(--semi-color-warning)", height: "24px" }}
            />
          }
        >
          <Nav.Item itemKey={"adminUser"} text={t("adminUser")} />
          <Nav.Item itemKey={"adminProduct"} text={t("adminProduct")} />
          <Nav.Item itemKey={"telegrame"} text={t("adminTG")} />
        </Nav.Sub>
      ) : (
        ""
      )}
      <Nav.Footer collapseButton={true} />
    </Nav>
  );
};

export default NavNode;
