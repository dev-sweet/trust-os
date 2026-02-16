import { create } from "zustand";
import { persist } from "zustand/middleware";

type AccountType = "personal" | "business";
type Id = string;

interface AccountState {
  accountType: AccountType;
  id: Id | null;

  switchToPersonal: (id: string) => void;
  switchToBusiness: (id: string) => void;
}

export const useActiveAccount = create<AccountState>()(
  persist(
    (set) => ({
      accountType: "personal",
      id: null,

      switchToPersonal: (id) => set({ accountType: "personal", id }),

      switchToBusiness: (businessId) =>
        set({ accountType: "business", id: businessId }),
    }),
    {
      name: "active-account-storage", // localStorage key
    },
  ),
);
