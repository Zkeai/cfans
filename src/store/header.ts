import { create } from 'zustand';
import { hasAuthToken } from '@/utils/utils'

export const useHeaderStore = create((set) => ({
    user: undefined,
    hasAuthToken,
    setUser: (user: any) => set({ user }),
    removeUser: () => set({ user: undefined }),

}));