//init env
import "dotenv/config";

import { initSentry, routeTimer } from "libautech-backend";
initSentry();
import * as Sentry from "@sentry/node";
//
import "isomorphic-fetch";
import { join } from "path";
import { readFileSync } from "fs";
import express, { Request, Response } from "express";
import serveStatic from "serve-static";
import mongoose from "mongoose";
import cron from "node-cron";
import cors from "cors";
import { InitPackage, Mantle, privacyWebhooks, shopify } from "libautech-backend";

// Schemas
import SettingsSchema from "./schemas/SettingsSchema.js";
import EventTrackSchema from "./schemas/EventTrackSchema.js";
import WebVitalsSchema from "./schemas/WebVitalsSchema.js";

import { billingCheck } from "./cronjobs/BillingCronJob.js";
import { afterAuth } from "./afterAuth.js";

import shopRoutes from "./routes/shop.js";
import proxyRoutes from "./routes/proxy.js";
import eventsRoutes from "./routes/events.js";
import webhookHandlers from "./webhooks.js";
import MANTLE_PLANS from "./constants/mantlePlans.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || "3000", 10);

const STATIC_PATH =
  process.env.NODE_ENV !== "development"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

const isLocal = process.env.IS_LOCAL === "true";

const URI = process.env.MONGO_URI || "";

app.use(routeTimer({ routes: [shopify.config.auth.callbackPath, shopify.config.auth.path] }));
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  afterAuth,
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({
    webhookHandlers: { ...privacyWebhooks, ...webhookHandlers },
  })
);

InitPackage({
  appName: process.env.APP_NAME,
  mongoose: mongoose,
  SettingsSchema: SettingsSchema,
  EventTrackSchema: EventTrackSchema,
  WebVitalsSchema: WebVitalsSchema,
  MantleClient: new Mantle({
    appId: process.env.MANTLE_APP_ID || "",
    appApiKey: process.env.MANTLE_APP_API_KEY || "",
  }),
  plans: MANTLE_PLANS,
  APP_METAFIELD_NAMESPACE: "libautech_leons", //TODO: change project wide
  versions: {
    plans: 2,
  },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/public/static", serveStatic(join(process.cwd(), "static")));

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use(routeTimer({ routes: ["/api/*"] }));

app.use("/api/shop", shopRoutes);
app.use("/api/events", eventsRoutes);

// Define proxy routes to avoid authentication
app.use("/proxy", proxyRoutes);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

const devIndexParse = async (_req: Request, res: Response): Promise<Response> => {
  const htmlPath = join(STATIC_PATH, "index.html");
  let html = readFileSync(htmlPath, "utf8");
  // On dev it parses %VITE_SHOPIFY_API_KEY% and replaces with env variable, on prod we build it so vite already replaces it in the files aka no need to replace and waste resources
  html = html.replace(
    "%VITE_SHOPIFY_API_KEY%",
    process.env.SHOPIFY_API_KEY || process.env.VITE_SHOPIFY_API_KEY || ""
  );
  return res.status(200).set("Content-Type", "text/html").send(html);
};

app.use(
  "/*",
  shopify.ensureInstalledOnShop(),
  process.env.NODE_ENV === "development"
    ? devIndexParse //local
    : async (_req: Request, res: Response): Promise<Response> => {
        return res
          .status(200)
          .set("Content-Type", "text/html")
          .send(readFileSync(join(STATIC_PATH, "index.html")));
      }
);

app.use(Sentry.expressErrorHandler());

mongoose.set("strictQuery", false);
mongoose
  .connect(URI, {
    dbName: process.env.MONGO_DB,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT);

    console.log(`> isLocal: `, isLocal);
    if (!isLocal) {
      // Always run this on start
      (async () => {
        billingCheck();
      })();
      cron.schedule("0/5 * * * *", () => {
        billingCheck();
      });
    }
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
