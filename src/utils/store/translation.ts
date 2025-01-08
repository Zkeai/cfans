import { create } from "zustand";

type TranslationStore = {
    lang: "zh" | "en";
    setlang: (lang: "zh" | "en") => void;
};

export const useTranslationStore = create<TranslationStore>((set) => ({
    lang: "zh", // 默认实现，防止初始调用报错
    setlang: (lang) => set({ lang }),
}));