"use client";
import React from "react";
import Style from "@/components/components.module.css";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandYoutube,
  IconBrandTinderFilled,
} from "@tabler/icons-react";
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
const Footer: React.FC<{ content: string }> = ({
  content,
}: {
  content: string;
}) => {
  const socialclickHandle = (url: string) => {
    window.open(url, "_blank");
  };
  return (
    <div className=" w-full h-14 flex fixed bottom-0 bg-[--semi-color-warning] items-center">
      <div className="flex w-1/3 space-x-5 pl-10">
        <IconBrandTinderFilled
          size={26}
          style={{ color: "var(--semi-color-danger)" }}
        />
        <span className="font-bold">{content}</span>
      </div>
      <div className="grow"></div>
      <div className="flex w-1/5 space-x-10">
        <IconBrandGithub
          size={26}
          className={Style.social}
          onClick={() => socialclickHandle(socialUrl.github)}
        />
        <IconBrandYoutube
          size={26}
          className={Style.social}
          onClick={() => socialclickHandle(socialUrl.youtube)}
        />
        <IconBrandTwitter
          size={26}
          className={Style.social}
          onClick={() => socialclickHandle(socialUrl.twitter)}
        />

        <IconBrandTelegram
          size={26}
          className={Style.social}
          onClick={() => socialclickHandle(socialUrl.dianbao)}
        />

        <IconBrandDiscord
          size={26}
          className={Style.social}
          onClick={() => socialclickHandle(socialUrl.discord)}
        />
      </div>
    </div>
  );
};

export default Footer;
