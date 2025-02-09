import { create } from "zustand";

type ITgAdminsStore = {
    admins: string[];
    setAdmins: (admins: string[]) => void;
};

export const useTgAdminStore = create<ITgAdminsStore>((set) => ({
    admins: [],
    setAdmins: (admins) => set({ admins }),
}));