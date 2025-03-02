import { create } from "zustand";

type State = {
  user: null | object;
  setUser: (user: object | null) => void;
};

export const useStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
