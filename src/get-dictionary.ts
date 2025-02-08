/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18n, type Locale } from './i18n-config';

const dictionaries = {
  zh: () => import('./dictionaries/zh.json'),
  en: () => import('./dictionaries/en.json'),
};

export const getDictionary = async (locale: Locale) => {
  const ossResult = await getDictionaryByOss(locale);
  if (ossResult) {
    return createDictionaryFunction(ossResult);
  }

  if (i18n.locales.includes(locale)) {
    const dict = await dictionaries[locale]();
    return createDictionaryFunction(dict as unknown as Record<string, string>);
  }

  return createDictionaryFunction({});
};

export const getDictionaryByOss = async (locale: Locale) => {
  if (!process.env.NEXT_PUBLIC_I18N_HOSTS) return;

  const url = `${process.env.NEXT_PUBLIC_I18N_HOSTS}/article/${locale}.json`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {

  }

  return;
};

// 动态插入功能
const createDictionaryFunction = (dictionary: Record<string, string>) => {
  return (key: string, variables?: Record<string, string>): string => {
    const template = dictionary[key] || key; // 如果没有找到则返回 key
    return interpolate(template, variables);
  };
};

const interpolate = (template: string, variables?: Record<string, string>): string => {
  if (!variables) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] || '');
};