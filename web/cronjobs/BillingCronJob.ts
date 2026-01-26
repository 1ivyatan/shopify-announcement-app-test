import { MantleClient } from "libautech-backend/src/singletons.js";
// Utils
import { chunkArray } from "../utils/generalUtils.js";

// Schemas
import SettingsSchema from "../schemas/SettingsSchema.js";
import SessionSchema from "../schemas/SessionSchema.js";
import { ISettings } from "../schemas/SettingsSchema.js";

let successful = 0;
let failed = 0;

export const billingCheck = async (shop: string | null = null): Promise<void> => {
  console.time("Billing job total");

  successful = 0;
  failed = 0;
  let settings: ISettings[] = [];
  if (shop) {
    settings = await SettingsSchema.find({ shop, isInstalled: true });
  } else {
    settings = await SettingsSchema.find({ isInstalled: true });
  }
  const chunkSize = 5;
  const settingsChunks = chunkArray(settings, chunkSize);
  for (const settingsChunk of settingsChunks) {
    await Promise.all(
      settingsChunk.map(async (settings) => {
        await billingCronLogic(settings);
      })
    );
  }

  console.timeEnd("Billing job total");

  console.log(`Billing Cron: ✅: ${successful} ❌: ${failed}`);
};

export async function billingCronLogic(shopSettings: ISettings): Promise<void> {
  try {
    const shop = shopSettings.shop;
    const session = await SessionSchema.findOne({ shop });
    let subscription = null;
    try {
      if (shopSettings.mantleApiToken) {
        subscription = await MantleClient?.getMantleSubscription(shopSettings.mantleApiToken);
      }
    } catch (err) {
      console.error(`Failed to get subscription for ${shop}`);
    }

    // impl here

    successful++;
  } catch (err) {
    console.error(err);
    failed++;
  }
}
