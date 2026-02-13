import { create } from "zustand";

type AccountType = "personal" | "business";
type Id = string;

interface AccountState {
  accountType: AccountType;
  id: Id | null;

  switchToPersonal: (id: string) => void;
  switchToBusiness: (id: string) => void;
}

export const useActiveAccount = create<AccountState>((set) => ({
  accountType: "personal",
  id: null,

  switchToPersonal: (id) => set({ accountType: "personal", id }),
  switchToBusiness: (businessId) =>
    set({ accountType: "business", id: businessId }),
}));
