import express, { Request, Response, Router } from "express";

import { doEventEndpointLogic } from "libautech-backend";

const router: Router = express.Router();

interface EventConfig {
  unique: boolean;
  properties?: boolean;
}

interface TrackedEvent {
  type: string;
  properties?: Record<string, any>;
}

const eventMapping: Record<string, EventConfig> = {
  //preset_countdown_toggle: { unique: false, properties: true },
  //...
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const { trackedEvent } = req.body;
    const { session } = res.locals.shopify;
    const { shop } = session;

    res.status(200).send();

    await doEventEndpointLogic(
      shop,
      trackedEvent,
      async (trackedEvent: TrackedEvent, eventTrack: any) => {
        const { type, properties = {} } = trackedEvent;
        const eventConfig = eventMapping[type];
        try {
          if (eventConfig) {
            let processedProperties = properties;

            return {
              event: type,
              value: processedProperties,
              properties: processedProperties,
              unique: eventConfig.unique,
            };
          } else {
            return null;
          }
        } catch (err) {
          return null;
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

export default router;
