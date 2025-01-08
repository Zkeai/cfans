"use client";
import React from "react";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandYoutube,
  IconBrandTinderFilled,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface SocialUrl {
  github: string;
  youtube: string;
  twitter: string;
  dianbao: string;
  discord: string;
}

const socialUrl: SocialUrl = {
  github: "https://github.com/zkeai",
  youtube: "https://www.youtube.com/channel/UClhZUsoeyNF5kDZ-OO4y0sw",
  twitter: "https://x.com/muyu_eth",
  dianbao: "https://t.me/+E3Q1hMARTfozNjQ1",
  discord: "https://discord.gg/ZDtxG247RE",
};

const Footer: React.FC<{ content: string }> = ({ content }) => {
  const pathname = usePathname();
  const isLoginPage =
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/payment");
  if (isLoginPage) return null;
  const socialClickHandle = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-[--semi-color-warning] fixed bottom-0 py-3 px-4 md:px-10">
      {/* 主容器 */}
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* 左侧内容 */}
        <div className="flex items-center space-x-3">
          <IconBrandTinderFilled
            size={24}
            style={{ color: "var(--semi-color-danger)" }}
          />
          <span className="font-bold text-sm md:text-base">{content}</span>
        </div>

        {/* 右侧社交图标 */}
        <div className="mt-3 md:mt-0 flex space-x-4 md:space-x-8 overflow-x-auto">
          <IconBrandGithub
            size={22}
            className="cursor-pointer"
            onClick={() => socialClickHandle(socialUrl.github)}
          />
          <IconBrandYoutube
            size={22}
            className="cursor-pointer"
            onClick={() => socialClickHandle(socialUrl.youtube)}
          />
          <IconBrandTwitter
            size={22}
            className="cursor-pointer"
            onClick={() => socialClickHandle(socialUrl.twitter)}
          />
          <IconBrandTelegram
            size={22}
            className="cursor-pointer"
            onClick={() => socialClickHandle(socialUrl.dianbao)}
          />
          <IconBrandDiscord
            size={22}
            className="cursor-pointer"
            onClick={() => socialClickHandle(socialUrl.discord)}
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
