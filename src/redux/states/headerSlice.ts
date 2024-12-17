import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 定义 Tab 类型
interface Tab {
  path: string;
  title: string;
}

// 定义 HeaderState 类型
interface HeaderState {
  tabsData: Tab[];
  activeTab: string;
}

// 动态生成初始状态函数
const getInitialState = (lang: string): HeaderState => {
  const isZh = lang === "zh";
  return {
    tabsData: [
      {
        path: "/dashboard",
        title: isZh ? "首页" : "Home",
      },
    ],
    activeTab: isZh ? "首页" : "Home",
  };
};

// 默认语言（可在 Redux 初始化时动态设置语言）
const defaultLang = "zh";

// 创建切片
export const headerSlice = createSlice({
  name: "header",
  initialState: getInitialState(defaultLang), // 动态生成初始状态
  reducers: {
    // 添加标签
    addTab: (state, action: PayloadAction<Tab>) => {
      if (!state.tabsData.some((tab) => tab.path === action.payload.path)) {
        state.tabsData.push(action.payload);
      }
    },
    // 删除标签
    removeTab: (state, action: PayloadAction<string>) => {
      state.tabsData = state.tabsData.filter(
        (tab) => tab.path !== action.payload
      );
    },
    // 改变活跃的标签
    changeActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    // 设置语言（动态更新首页标题和活跃标签）
    setLanguage: (state, action: PayloadAction<string>) => {
      const isZh = action.payload === "zh";
      state.tabsData = [
        {
          path: "/dashboard",
          title: isZh ? "首页" : "Home",
        },
      ];
      state.activeTab = isZh ? "首页" : "Home";
    },
  },
});

// 导出 actions
export const { addTab, removeTab, changeActiveTab, setLanguage } =
  headerSlice.actions;

// 导出 reducer
export default headerSlice.reducer;