import { create } from 'zustand';

export const useHeaderStore = create((set) => ({
    user: undefined, // 初始状态
    setUser: (user: any) => set({ user }), // 设置用户数据
    removeUser: () => set({ user: undefined }), // 清空用户数据
}));