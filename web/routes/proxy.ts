// Core
import express, { Request, Response, Router } from "express";
import { registerEmbedLog } from "../utils/conversionUtils.js";

// Schemas

// Constants
import { widgetGzipped, widgetVersion } from "../constants/widgetGzipped.js";
import { setCodeMetafield } from "../utils/widgetScriptUtils.js";
import AnnouncementSchema from "../schemas/AnnouncementSchema.js";

const router: Router = express.Router();

// In-memory debounce map: { shop: lastUpdateTimestamp }
const widgetUpdateDebounce = new Map<string, number>();
const DEBOUNCE_DURATION = 60 * 1000; // 1 minute in milliseconds

/**
 * Check if widget update should be allowed for a shop
 * @param shop - Shop domain
 * @returns True if update is allowed (debounce period has passed)
 */
function shouldUpdateWidget(shop: string): boolean {
  const now = Date.now();
  const lastUpdate = widgetUpdateDebounce.get(shop);

  if (!lastUpdate || now - lastUpdate >= DEBOUNCE_DURATION) {
    widgetUpdateDebounce.set(shop, now);
    return true;
  }

  return false;
}

/* 
The updating logic is in EmbedLogSchema.js. I'm sending it with the alive fetch to reduce the number of fetches.
In the case of a critical failure (i.e., when there is no metafield), we assume this is fetched only when there's no metafield, so we set it after returning.

This uses a debounce of 1 minute per shop.
*/

router.put("/sendstats", async (req: Request, res: Response) => {
  const { ids } = req.body ?? {};

  if (ids && ids.length > 0) {
    try {

      await AnnouncementSchema.updateMany({_id: { $in: ids }},
        { $inc: { "views": 1 } }
      ).exec();

      return res.status(200).json({
        meta: {
          success: true
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Server error"
      });
    }
  } else {
    return res.status(400).json({
      error: "No params"
    });
  }
  
});

router.get("/widget", async (req: Request, res: Response) => {
  try {
    res.send({ version: widgetVersion, code: widgetGzipped });

    const shop = req.query.shop as string;

    // Only update metafield if debounce period has passed
    if (shouldUpdateWidget(shop)) {
      setCodeMetafield({ shop });
    }
  } catch (err) {
    console.error("Error in /widget:", err);
    res.status(500).send();
  }
});

// Register embed log (info or error)
router.post("/logs", async (req: Request, res: Response) => {
  try {
    const { shop } = req.query; //shopify should add the param automatically
    const { level, type, message, pageUrl, offerId, offerType, properties } = req.body;

    if (!shop) {
      return res.status(400).send("Shop parameter is required");
    }

    if (!level || !["info", "error"].includes(level)) {
      return res.status(400).send("Invalid or missing level parameter");
    }

    const saved = await registerEmbedLog(shop as string, level as "info" | "error", {
      type,
      message,
      pageUrl,
      offerId,
      offerType,
      properties,
    });

    res.status(200).json({ saved });
  } catch (err) {
    console.error("Error in /logs:", err);
    res.status(500).send();
  }
});

export default router;
