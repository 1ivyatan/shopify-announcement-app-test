interface PlanLimits {
  orders: number;
}

interface PlanDetails {
  id: string;
  name: string;
  amount: number;
  originalAmount?: number;
  discount?: number;
  features: string[];
  limits: PlanLimits;
  aliasIds?: string[];
  [key: string]: any;
}

interface PlanTiers {
  monthly: PlanDetails;
  annual: PlanDetails;
  [cycle: string]: PlanDetails;
}

interface MantlePlans {
  starter: PlanTiers;
  pro: PlanTiers;
  unlimited: PlanTiers;
  [planTypeName: string]: PlanTiers;
}

const MANTLE_PLANS = ((): MantlePlans | Record<string, never> => {
  console.log("MANTLE_PLANS: Loading plans for environment:", process.env.NODE_ENV);

  // PROD
  // "a453c3b2-b34d-4fa4-b8bb-edf565a71c1e": {
  //       name: "starter",
  //       amount: 9.99,
  //       features: ["Plans.PlanFeatures.Feature1"],
  //       limits: { orders: 100 },
  //     },
  //     "b18e25f3-4e6f-4a92-ae18-f40df6f840f3": {
  //       name: "pro",
  //       amount: 29.99,
  //       features: ["Plans.PlanFeatures.Feature5"],
  //       limits: { orders: 1000 },
  //     },
  //     "2b937324-328c-4cfd-8a33-372d14bce25b": {
  //       name: "unlimited",
  //       amount: 49.99,
  //       features: ["Plans.PlanFeatures.Feature9"],
  //       limits: { orders: -1 },
  //     },

  if (process.env.NODE_ENV === "production") {
    return {
      starter: {
        monthly: {
          id: "a453c3b2-b34d-4fa4-b8bb-edf565a71c1e",
          name: "starter",
          amount: 9.99,
          features: ["Plans.PlanFeatures.Feature1"],
          limits: { orders: 100 },
        },
        annual: {
          id: "6812f61d-6e81-4d58-a9dc-419b99714b69",
          name: "starter",
          amount: 7.99,
          originalAmount: 9.99,
          discount: 20,
          features: ["Plans.PlanFeatures.Feature1"],
          limits: { orders: 100 },
        },
      },
      pro: {
        monthly: {
          id: "b18e25f3-4e6f-4a92-ae18-f40df6f840f3",
          name: "pro",
          amount: 29.99,
          features: ["Plans.PlanFeatures.Feature5"],
          limits: { orders: 1000 },
        },
        annual: {
          id: "0efc1c95-5b69-457e-bc38-21494b95818a",
          name: "pro",
          discount: 20,
          amount: 23.99,
          originalAmount: 29.99,
          features: ["Plans.PlanFeatures.Feature5"],
          limits: { orders: 1000 },
        },
      },

      unlimited: {
        monthly: {
          id: "2b937324-328c-4cfd-8a33-372d14bce25b",
          name: "unlimited",
          amount: 49.99,
          features: ["Plans.PlanFeatures.Feature9"],
          limits: { orders: -1 },
        },
        annual: {
          id: "d97b6631-352f-4e8e-aed8-d069d9c1c339",
          name: "unlimited",
          discount: 20,
          amount: 39.99,
          originalAmount: 49.99,
          features: ["Plans.PlanFeatures.Feature9"],
          limits: { orders: -1 },
        },
      },
    };
  }

  // DEV
  //   "2d5e9c4a-02ae-4a07-96ea-f111ddf33dbf": {
  //   name: "starter",
  //   amount: 9.99,
  //   features: ["Plans.PlanFeatures.Feature1"],
  //   limits: { orders: 100 },
  // },
  // "6246fa3f-42da-42c8-ad0b-8b2f14b6b860": {
  //   name: "pro",
  //   amount: 29.99,
  //   features: ["Plans.PlanFeatures.Feature5"],
  //   limits: { orders: 1000 },
  // },
  // "102aaf20-1a7e-45be-85bf-d3c404547ad5": {
  //   name: "unlimited",
  //   amount: 49.99,
  //   features: ["Plans.PlanFeatures.Feature9"],
  //   limits: { orders: -1 },
  // },

  if (process.env.NODE_ENV === "development") {
    return {
      starter: {
        monthly: {
          id: "2d5e9c4a-02ae-4a07-96ea-f111ddf33dbf",
          name: "starter",
          amount: 9.99,
          features: ["Plans.PlanFeatures.Feature1"],
          limits: { orders: 100 },
        },
        annual: {
          id: "faecbd96-6a6c-43e2-a590-4eae4ef9e773",
          name: "starter",
          amount: 7.99,
          originalAmount: 9.99,
          discount: 20,
          features: ["Plans.PlanFeatures.Feature1"],
          limits: { orders: 100 },
        },
      },
      pro: {
        monthly: {
          id: "6246fa3f-42da-42c8-ad0b-8b2f14b6b860",
          name: "pro",
          amount: 29.99,
          features: ["Plans.PlanFeatures.Feature5"],
          limits: { orders: 1000 },
        },
        annual: {
          id: "180117aa-233b-40ba-86b1-3a8f6fccffa7",
          name: "pro",
          discount: 20,
          amount: 23.99,
          originalAmount: 29.99,
          features: ["Plans.PlanFeatures.Feature5"],
          limits: { orders: 1000 },
        },
      },

      unlimited: {
        monthly: {
          id: "102aaf20-1a7e-45be-85bf-d3c404547ad5",
          name: "unlimited",
          amount: 49.99,
          features: ["Plans.PlanFeatures.Feature9"],
          limits: { orders: -1 },
        },
        annual: {
          id: "ecc8310f-926d-41b4-9220-32bbc00b026f",
          name: "unlimited",
          discount: 20,
          amount: 39.99,
          originalAmount: 49.99,
          features: ["Plans.PlanFeatures.Feature9"],
          limits: { orders: -1 },
        },
      },
    };
  }

  // STAGING
  //   "8b9a0734-96e3-4eef-8d5a-45843ac81a65": {
  //   name: "starter",
  //   amount: 9.99,
  //   features: ["Plans.PlanFeatures.Feature1"],
  //   limits: { orders: 100 },
  // },
  // "4baa01c8-c3ae-4766-b819-4b35ebe735e8": {
  //   name: "pro",
  //   amount: 29.99,
  //   features: ["Plans.PlanFeatures.Feature5"],
  //   limits: { orders: 1000 },
  // },
  // "76a2c657-2376-462c-a883-67952c072292": {
  //   name: "unlimited",
  //   amount: 49.99,
  //   features: ["Plans.PlanFeatures.Feature9"],
  //   limits: { orders: -1 },
  // },

  //
  if (process.env.NODE_ENV === "staging") {
    return {
      starter: {
        monthly: {
          id: "8b9a0734-96e3-4eef-8d5a-45843ac81a65",
          name: "starter",
          amount: 9.99,
          features: ["Plans.PlanFeatures.Feature1"],
          limits: { orders: 100 },
        },
        annual: {
          id: "bed7dee3-ad96-4ebc-b70f-f8ba88a43485",
          name: "starter",
          amount: 7.99,
          originalAmount: 9.99,
          discount: 20,
          features: ["Plans.PlanFeatures.Feature1"],
          limits: { orders: 100 },
        },
      },
      pro: {
        monthly: {
          id: "4baa01c8-c3ae-4766-b819-4b35ebe735e8",
          name: "pro",
          amount: 29.99,
          features: ["Plans.PlanFeatures.Feature5"],
          limits: { orders: 1000 },
        },
        annual: {
          id: "3468e3f7-2774-4dcc-8771-c0c34e7cd257",
          name: "pro",
          discount: 20,
          amount: 23.99,
          originalAmount: 29.99,
          features: ["Plans.PlanFeatures.Feature5"],
          limits: { orders: 1000 },
        },
      },

      unlimited: {
        monthly: {
          id: "76a2c657-2376-462c-a883-67952c072292",
          name: "unlimited",
          amount: 49.99,
          features: ["Plans.PlanFeatures.Feature9"],
          limits: { orders: -1 },
        },
        annual: {
          id: "5d8133f3-5b25-49c4-956b-d6f472c99d50",
          name: "unlimited",
          discount: 20,
          amount: 39.99,
          originalAmount: 49.99,
          features: ["Plans.PlanFeatures.Feature9"],
          limits: { orders: -1 },
        },
      },
    };
  }
  console.warn("MANTLE_PLANS: No matching environment, returning empty plans");
  return {};
})();

export default MANTLE_PLANS;
export type { MantlePlans, PlanTiers, PlanDetails, PlanLimits };
