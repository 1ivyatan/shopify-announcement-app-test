import mongoose, { Schema, InferSchemaType } from "mongoose";

const DeepShopDataSchema = new Schema({}, { strict: false, timestamps: true });

export type IDeepShopData = InferSchemaType<typeof DeepShopDataSchema>;

export default mongoose.model("DeepShopData", DeepShopDataSchema);
