import mongoose, { Schema, Document, Model } from "mongoose";
import { widgetVersion } from "../constants/widgetGzipped.js";
import { setCodeMetafield } from "../utils/widgetScriptUtils.js";

export interface IEmbedLog extends Document {
  shop: string;
  level: "info" | "error";
  type: string;
  message: string;
  pageUrl: string;
  properties: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface LogConfig {
  level: string;
  unique?: boolean;
  preProcess?: (shop: string, data: Partial<IEmbedLog>) => void | Promise<void>;
  uniqueCondition?: (shop: string, data: Partial<IEmbedLog>) => Promise<boolean>;
  saveCondition?: (shop: string, data: Partial<IEmbedLog>) => Promise<boolean>;
  description?: string;
}

interface IEmbedLogModel extends Model<IEmbedLog> {
  LOG_TYPES: Record<string, LogConfig>;
  shouldSaveLog(
    shop: string,
    type: string,
    level: string,
    data: Partial<IEmbedLog>
  ): Promise<boolean>;
}

const EmbedLogSchema = new Schema<IEmbedLog>(
  {
    shop: { type: String, required: true },
    level: {
      type: String,
      enum: ["info", "error"],
      required: true,
    },
    // General log type/category
    type: { type: String, default: "" }, // id for type of event defined in proxy

    message: { type: String, default: "" },

    // Optional context
    pageUrl: { type: String, default: "" },

    // Custom properties for log-specific data
    properties: { type: Object, default: {} }, // e.g., { should_render: true, version: "1.7.8" }
  },
  { timestamps: true }
);

// Index for efficient querying
EmbedLogSchema.index({ shop: 1, createdAt: -1 });
EmbedLogSchema.index({ shop: 1, level: 1 });
EmbedLogSchema.index({ shop: 1, type: 1 });
EmbedLogSchema.index({ shop: 1, type: 1, "properties.should_render": 1 });

async function updateCodeMetafield(shop: string, data: Partial<IEmbedLog>): Promise<void> {
  const p = data.properties || {};
  if (p.code_source !== "metafield") {
    // only set if its from metafield as proxy will be handled in proxy.js when it serves it
    return;
  }

  if (p.code_version && p.code_version === widgetVersion) {
    // same version as proxy, skip
    return;
  }

  setCodeMetafield({ shop, session: undefined });
}

// Log type configuration
const LOG_TYPES: Record<string, LogConfig> = {
  embed_enabled: {
    level: "info",
    unique: true,
    preProcess: updateCodeMetafield,
    uniqueCondition: async function (this: IEmbedLogModel, shop: string, data: Partial<IEmbedLog>) {
      if (data.properties?.should_render === true || data.properties?.should_render === "true") {
        const existingLog = await this.findOne({
          shop,
          type: "embed_enabled",
          "properties.should_render": true,
        });
        return !existingLog; // Return true if we should save (no existing log)
      }
      return true; // yes should save if false
    },
    description: "Embed script loaded and enabled status checked",
  },

  block_enabled: {
    level: "info",
    unique: true,
    preProcess: updateCodeMetafield,
    uniqueCondition: async function (this: IEmbedLogModel, shop: string, data: Partial<IEmbedLog>) {
      return false; // for now dont save just do updates for metafield
    },
  },
};

// Attach static properties
(EmbedLogSchema.statics as any).LOG_TYPES = LOG_TYPES;

// Method to check if a log should be saved based on uniqueness rules
(EmbedLogSchema.statics as any).shouldSaveLog = async function (
  shop: string,
  type: string,
  level: string,
  data: Partial<IEmbedLog>
): Promise<boolean> {
  const logConfig = LOG_TYPES[type];

  if (!logConfig) {
    return true; // No specific config, always save
  }
  if (logConfig.preProcess) {
    try {
      await logConfig.preProcess.call(this, shop, data);
    } catch (err) {
      //
    }
  }

  if (logConfig.saveCondition) {
    return await logConfig.saveCondition.call(this, shop, data);
  }

  if (!logConfig?.unique) {
    return true;
  }

  if (logConfig.uniqueCondition) {
    return await logConfig.uniqueCondition.call(this, shop, data);
  }

  const existingLog = await this.findOne({ shop, type });
  return !existingLog;
};

export default mongoose.model<IEmbedLog, IEmbedLogModel>("EmbedLog", EmbedLogSchema);
