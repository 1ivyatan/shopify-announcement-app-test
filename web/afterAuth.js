import { getSessionDetails, logRouteTiming } from "libautech-backend";
import { shopify } from "libautech-backend";
import { MantleClient } from "libautech-backend/src/singletons.js";

// Utils
import { getShopDetails, getDeepShopData } from "./utils/graphUtils.js";

// Schemas
import SettingsSchema from "./schemas/SettingsSchema.js";
import DeepShopDataSchema from "./schemas/DeepShopDataSchema.js";

export const runAfterAuth = async (shop, session) => {
  const client = new shopify.api.clients.Graphql({
    session: session,
  });
  storeDeepShopData(shop, client);
  const shopGraph = await getShopDetails(client);
  const { id, email, name, currencyCode, currencyFormats, plan } = shopGraph;
  await shopify.api.webhooks.register({
    session: session,
  });
  const mantleApiToken = await MantleClient.createMantleRecord(session, id, email, name);
  let shopSettings = await SettingsSchema.findOne({ shop: shop });

  const fakePreview = new Date();
  fakePreview.setHours(fakePreview.getHours() + 2);

  if (shopSettings) {
    shopSettings.isInstalled = true;
    shopSettings.email = email;
    shopSettings.storeId = id;
    shopSettings.name = name;
    shopSettings.currencyCode = currencyCode;
    shopSettings.moneyFormat = currencyFormats.moneyFormat;
    shopSettings.mantleApiToken = mantleApiToken;
    if (!shopSettings.fakePreview) {
      shopSettings.fakePreview = fakePreview;
    }
    shopSettings.save();
  } else {
    //@ts-ignore
    shopSettings = await SettingsSchema.create({
      shop: shop,
      email: email,
      storeId: id,
      name: name,
      currencyCode: currencyCode,
      moneyFormat: currencyFormats.moneyFormat,
      mantleApiToken: mantleApiToken,
      fakePreview: fakePreview,
      isInstalled: true,
    });
  }
};

export const afterAuth = async (req, res, next) => {
  const startTime = performance.now(); // Start timing
  const { session, shop } = getSessionDetails(res);
  console.log(`AfterAuth: ${shop}`);
  await runAfterAuth(shop, session);
  logRouteTiming({
    shop: shop || "Unauthenticated",
    path: "AfterAuth Method",
    duration: performance.now() - startTime,
  });
  next();
};

export const storeDeepShopData = async (shop, client) => {
  try {
    const deepShopData = await getDeepShopData(client);
    const deepShopDataRecord = new DeepShopDataSchema({ shopName: shop, ...deepShopData });
    await deepShopDataRecord.save();
  } catch (err) {
    console.error(err);
  }
};
