import { DeliveryMethod } from "@shopify/shopify-api";

import SettingsSchema from "./schemas/SettingsSchema.js";
import { deleteManagerPlan } from "libautech-backend";
import { appName } from "libautech-backend/src/singletons.js";

export default {
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    // eslint-disable-next-line no-unused-vars
    callback: async (topic, shop, body, webhookId) => {
      // const payload = JSON.parse(body);
      try {
        deleteManagerPlan(shop, appName);
        await SettingsSchema.findOneAndUpdate(
          { shop: shop },
          { isInstalled: false, mantleApiToken: "" }
        );
      } catch (err) {}
    },
  },
};
