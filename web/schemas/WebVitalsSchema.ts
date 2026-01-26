import mongoose, { Schema, InferSchemaType } from "mongoose";

const WebVitalsSchema = new Schema({}, { strict: false });

export type IWebVitals = InferSchemaType<typeof WebVitalsSchema>;

export default mongoose.model("WebVitals", WebVitalsSchema);
