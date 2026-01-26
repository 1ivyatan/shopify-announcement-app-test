import { create } from "zustand";

interface ShopInfoState {
  name: string | null;
  email: string | null;
  fetching: boolean;
  mantleApiToken: string | null;
  plan: string | null;
  plans: any[] | null;
  planFetching: boolean;
  hasHadTrial: boolean;
  firstOfferCreated: boolean;
  payingApp: string | null;
  isPayingApp: boolean | null;
  isPaid: boolean;
  planInterval: NodeJS.Timeout | null;
  currencyCode: string | null;
  moneyFormat: string | null;
  enabledBlocks: any | null;
  allBlocks: any | null;
  completedSetup: boolean | null;
  previewEndDate: string | null;
  themeStoreId: string | null;
  billingCycle: "monthly" | "yearly";
  fetchData: () => Promise<ShopInfoState>;
  fetchPlans: () => Promise<void>;
  setFirstOfferCreated: (value: boolean) => void;
  completeSetup: () => Promise<void>;
  startPreview: (shopify: any) => Promise<{ success: boolean }>;
}

const useShopInfoStore = create<ShopInfoState>((set, get) => ({
  // Define your state variables here
  name: null,
  email: null,
  fetching: true,
  mantleApiToken: null,
  plan: null,
  plans: null,
  planFetching: true,
  hasHadTrial: true,
  firstOfferCreated: false,
  payingApp: null,
  isPayingApp: null,
  isPaid: false,
  planInterval: null,
  currencyCode: null,
  moneyFormat: null,
  enabledBlocks: null,
  allBlocks: null,
  completedSetup: null,
  previewEndDate: null,
  themeStoreId: null,
  billingCycle: "monthly",

  fetchData: async () => {
    const { planInterval } = get();
    set({ planFetching: !planInterval });

    const rawData = await fetch("/api/shop");
    const data = await rawData.json();

    const sortedAllBlocks = data.allBlocks
      ? Object.keys(data.allBlocks)
          .sort()
          .reduce((sorted: any, key) => {
            sorted[key] = data.allBlocks[key];
            return sorted;
          }, {})
      : data.allBlocks;

    set({
      fetching: false,
      name: data.name,
      email: data.email,
      mantleApiToken: data.mantleApiToken,
      plan: data.planType,
      payingApp: data.payingApp,
      hasHadTrial: data.hasHadTrial,
      isPayingApp: data.isPayingApp,
      isPaid: data.isPaid,
      currencyCode: data.currencyCode,
      moneyFormat: data.moneyFormat,
      enabledBlocks: data.enabledBlocks,
      allBlocks: sortedAllBlocks,
      firstOfferCreated: data.firstOfferCreated,
      completedSetup: data.completedSetup,
      previewEndDate: data.previewEndDate,
      themeStoreId: data.themeId,
      billingCycle: data.billingCycle,
    });

    (window as any).userEmail = data.email;

    // Start interval if not already running
    if (!planInterval) {
      const interval = setInterval(() => {
        get().fetchData();
      }, 10000);
      set({ planInterval: interval });
    }

    return get();
  },

  fetchPlans: async () => {
    const rawData = await fetch("/api/shop/plans");
    const data = await rawData.json();
    set({ plans: data });
  },

  setFirstOfferCreated: (value) => {
    set({ firstOfferCreated: value });
  },
  completeSetup: async () => {
    await fetch("/api/shop/update-setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  startPreview: async (shopify) => {
    const rawData = await fetch("/api/shop/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await rawData.json();
    if (data.success) {
      shopify.toast.show("Preview started!");
      set({ previewEndDate: data.previewEndDate });
      return { success: true };
    } else {
      shopify.toast.show(data.message || "Failed to start preview", { isError: true });
      return { success: false };
    }
  },
}));

export default useShopInfoStore;
