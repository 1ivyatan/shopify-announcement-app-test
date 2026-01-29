import express, { Request, Response, Router } from "express";
import {
  shopify,
  plansEndpoint,
  mantleCancelPlanEndpoint,
  getPlansFromManager,
  getThemeId,
  setMetafield,
} from "libautech-backend";
import { MantleClient } from "libautech-backend/src/singletons.js";
import { determineFinalPlan } from "libautech-backend";
import { checkAndPopulateShopSettings } from "../utils/graphUtils.js";
// Schemas
import SettingsSchema from "../schemas/SettingsSchema.js";
import AnnouncementSchema from "../schemas/AnnouncementSchema.js";
import { error } from "console";

const router: Router = express.Router();


router.get("/announcement", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const ann = await AnnouncementSchema.findOne({"shop": shop}).exec();

  return res.status(200).send({
    data: {
      enabled: ann?.enabled,
      text: ann?.text
    },
    success: true
  });
});

router.post("/announcement", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const { enabled, text } = _req.body ?? {};

  if (enabled == null || text == null) {
    return res.status(401).send({
      error: "all body params not supplied"
    });
  }

  try {
    await setMetafield(session, "announcementBar", JSON.stringify({ enabled: enabled, text: text }), "json");
    await AnnouncementSchema.findOneAndUpdate({"shop": shop}, { enabled: enabled, text: text}, { new: true, upsert: true });
    return res.status(200).send({
      success: true
    }); 
  } catch (error) {
    return res.status(500).send({error: "Server error"});
  }
});

router.get("/", async (_req: Request, res: Response) => {
  console.time("Shop");
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  // Get initial shop settings
  let shopSettings = await SettingsSchema.findOne({ shop: shop });
  // Get complete shop settings with any missing fields populated
  const completeSettings: any = await checkAndPopulateShopSettings(shopSettings, client, shop);
  // Now we can safely destructure all required fields
  const { storeId, email, name, currencyCode, moneyFormat } = completeSettings;
  // Check mantleApiToken and create if it doesn't exist
  let mantleApiToken = completeSettings?.mantleApiToken;
  if (!mantleApiToken) {
    mantleApiToken = await MantleClient?.createMantleRecord(session, storeId, email, name);
    await SettingsSchema.updateOne({ shop }, { mantleApiToken });
  }

  const [finalPlan, plans, themeId] = await Promise.all([
    (async () => {
      const customer = (await MantleClient?.getCustomer({ mantleApiToken, shop })) || undefined;
      const finalPlan = await determineFinalPlan(customer, completeSettings);

      if (finalPlan?.isPaid !== completeSettings.isPaid) {
        SettingsSchema.findOneAndUpdate({ shop: shop }, { isPaid: finalPlan?.isPaid }).catch(
          (err) => console.error("Failed to update isPaid:", err)
        );
      }
      return finalPlan;
    })(),
    getPlansFromManager(shop),
    getThemeId(session),
  ]);

  const secondsTillEnd =
    completeSettings.previewEndDate &&
    Math.floor((new Date(completeSettings.previewEndDate).getTime() - new Date().getTime()) / 1000);

  res.status(200).send({
    success: true,
    name: name,
    email: email,
    currencyCode,
    moneyFormat,
    mantleApiToken: mantleApiToken,
    previewEndDate: secondsTillEnd,
    ...finalPlan,
    isPayingApp: finalPlan.payingApp === process.env.APP_NAME,
    hasHadTrial: plans?.hasHadTrial?.overall,
    firstOfferCreated: completeSettings.firstOfferCreated,
    completedSetup: completeSettings.completedSetup,
    themeId,
  });
  console.timeEnd("Shop");
});

router.get("/plans", plansEndpoint);

router.get("/product-tags", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const client = new shopify.api.clients.Graphql({
    session,
  });
  const data = await client.request(
    `query {
        shop {
          productTags(first: 250) {
            edges {
              node
            }
          }
        }
      }`
  );
  const extractedData = data.data;
  const productTags = extractedData.shop.productTags.edges.map((x: any) => x.node);
  return res.status(200).send(productTags || []);
});

router.post("/cancel", mantleCancelPlanEndpoint);

export default router;

