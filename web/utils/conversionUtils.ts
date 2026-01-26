import EmbedLogSchema from "../schemas/EmbedLogSchema.js";
import { IEmbedLog } from "../schemas/EmbedLogSchema.js";

interface EmbedLogData {
  type?: string;
  message?: string;
  pageUrl?: string;
  offerId?: any;
  offerType?: any;
  properties?: Record<string, any>;
}

export async function registerEmbedLog(
  shop: string,
  level: "info" | "error",
  data: EmbedLogData = {}
): Promise<boolean> {
  const { type = "", message = "", pageUrl = "", properties = {} } = data;

  // Check if this log should be saved based on uniqueness rules
  const shouldSave = await EmbedLogSchema.shouldSaveLog(shop, type, level, { properties, ...data });

  if (!shouldSave) {
    console.log(`[EmbedLog] Skipping duplicate log: shop=${shop}, type=${type}`);
    return false;
  }

  await new EmbedLogSchema({
    shop,
    level,
    type,
    message,
    pageUrl,
    properties,
  }).save();

  return true;
}
