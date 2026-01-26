import mongoose, { Schema, InferSchemaType } from "mongoose";

const SettingsSchema = new Schema(
  {
    shop: { type: String },
    name: { type: String },
    email: { type: String },
    storeId: { type: String },
    currencyCode: { type: String },
    moneyFormat: { type: String },
    plan: { type: String },
    isInstalled: { type: Boolean },
    mantleApiToken: { type: String },
    completedSetup: { type: Boolean, default: false },
    previewEndDate: { type: Date, default: null },
    isPaid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ISettings = InferSchemaType<typeof SettingsSchema>;

export default mongoose.model("Settings", SettingsSchema);
