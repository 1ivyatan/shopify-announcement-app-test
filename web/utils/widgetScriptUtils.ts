import { setMetafield } from "libautech-backend";
import SessionSchema from "../schemas/SessionSchema.js";
import { widgetGzipped, widgetVersion } from "../constants/widgetGzipped.js";

interface SetCodeMetafieldParams {
  shop: string;
  session?: any;
}

export async function setCodeMetafield({ shop, session }: SetCodeMetafieldParams): Promise<void> {
  if (!session) session = await SessionSchema.findOne({ shop });

  setMetafield(
    session,
    "code",
    JSON.stringify({ version: widgetVersion, code: widgetGzipped }),
    "json"
  );
}
