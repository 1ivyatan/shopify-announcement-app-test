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

const updateMetafield = async (session: any) => {
  const { shop } = session;
  const anns = await AnnouncementSchema.aggregate([
    { $match: { shop: shop, enabled: true } },
    {
      $project: {
        _id: 1,
        text: 1,
        fgColor: 1,
        bgColor: 1,
        fontSize: 1,
      },
    },
    { $sort: { _id: -1 } },
  ]).exec();

  await setMetafield(session, "announcementBars", JSON.stringify(anns), "json");
};

router.get("/announcement/stats", async (_req: Request, res: Response) => {});

router.get("/announcement/meta", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const anns = await AnnouncementSchema.aggregate([
    { $match: { shop: shop, enabled: true } },
    {
      $project: {
        _id: 1,
        text: 1,
        fgColor: 1,
        bgColor: 1,
        fontSize: 1,
      },
    },
    { $sort: { _id: -1 } },
  ]).exec();

  return res.status(200).send({
    data: anns,
    meta: {
      success: true,
    },
  });
});

router.get("/announcement", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const { page } = _req.query ?? 0;
  const count = 10;

  const anns = await AnnouncementSchema.aggregate([
    { $match: { shop: shop } },
    {
      $project: {
        _id: 1,
        shop: 1,
        label: 1,
        enabled: 1,
        views: 1,
        text: { $substrCP: ["$text", 0, 50] },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { _id: -1 } },
    { $skip: parseInt(`${page}`) * count },
    { $limit: count },
  ]).exec();

  return res.status(200).send({
    data: anns,
    meta: {
      page: parseInt(`${page}`),
      success: true,
      hasNext: anns.length == count,
      hasPrev: parseInt(`${page}`) > 0 || anns.length == 0,
    },
  });
});

router.get("/announcement/:id", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const id = _req.params.id ?? null;

  if (id) {
    try {
      /* prevent someone from accessing banners foreign to them */
      const ann = await AnnouncementSchema.findOne({ shop: shop, _id: id }).exec();

      return res.status(200).send({
        data: ann,
        meta: {
          success: true,
        },
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({ error: "Server error" });
    }
  } else {
    return res.status(401).send({
      error: "Id not supplied",
    });
  }
});

router.post("/announcement", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const { enabled, text, fgColor, bgColor, fontSize, label } = _req.body ?? {};

  if (
    enabled == null ||
    text == null ||
    fgColor == null ||
    bgColor == null ||
    fontSize == null ||
    label == null
  ) {
    return res.status(401).send({
      error: "all body params not supplied",
    });
  }

  try {
    const banner = new AnnouncementSchema({
      enabled: enabled,
      shop: shop,
      text: text,
      fgColor: fgColor,
      bgColor: bgColor,
      fontSize: fontSize,
      label: label,
    });

    const saved = await banner.save();

    updateMetafield(session);
    // await setMetafield(session, "announcementBar", JSON.stringify({ enabled: enabled, text: text, fgColor: fgColor, bgColor: bgColor, fontSize: fontSize }), "json");
    //await AnnouncementSchema.findOneAndUpdate({"shop": shop},
    //   { enabled: enabled, text: text, fgColor: fgColor, bgColor: bgColor, fontSize: fontSize}
    //, { new: true, upsert: true });
    return res.status(200).send({
      data: saved,
      meta: {
        success: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
});

router.put("/announcement", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const sessionShop = session.shop;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const { _id, shop, enabled, label, text, fgColor, bgColor, fontSize } = _req.body ?? {};

  if (
    _id == null ||
    shop == null ||
    enabled == null ||
    label == null ||
    text == null ||
    bgColor == null ||
    fgColor == null ||
    fontSize == null
  ) {
    return res.status(401).send({
      error: "all body params not supplied",
    });
  }

  try {
    const saved = await AnnouncementSchema.findOneAndUpdate(
      { _id: _id, shop: sessionShop },
      {
        label: label,
        enabled: enabled,
        text: text,
        fgColor: fgColor,
        bgColor: bgColor,
        fontSize: fontSize,
      }
    );
    updateMetafield(session);
    return res.status(200).send({
      data: saved,
      meta: {
        success: true,
      },
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ error: "Server error" });
  }
});

router.delete("/announcement/:id", async (_req: Request, res: Response) => {
  const session = res.locals.shopify.session;
  const { shop } = session;
  const client = new shopify.api.clients.Graphql({
    session,
  });

  const id = _req.params.id ?? null;

  if (id) {
    try {
      /* prevent someone from accessing banners foreign to them */
      const ann = await AnnouncementSchema.findOne({ shop: shop, _id: id }).exec();
      await AnnouncementSchema.deleteOne({ shop: shop, _id: id }).exec();
      updateMetafield(session);

      return res.status(200).send({
        data: ann,
        meta: {
          success: true,
        },
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).send({ error: "Server error" });
    }
  } else {
    return res.status(401).send({
      error: "Id not supplied",
    });
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
