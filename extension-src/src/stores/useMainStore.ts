// Modules
import { create } from "zustand";

const useMainStore = create((set, get) => {
  return {
    temp: "temp data",
    setTemp: (data: any) => set({ temp: data }),
  };
});

export default useMainStore;
