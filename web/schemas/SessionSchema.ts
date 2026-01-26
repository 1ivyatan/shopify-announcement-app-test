import mongoose, { Schema, InferSchemaType } from "mongoose";

export const SessionSchema = new Schema({
  id: {
    type: String,
    required: [true, "Id is required"],
  },
  shop: {
    type: String,
    required: [true, "Shop name is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  isOnline: {
    type: Boolean,
    required: [true, "isOnline is required"],
  },
  scope: {
    type: String,
    required: [true, "Scope is required"],
  },
  accessToken: {
    type: String,
    required: [true, "AccessToken is required"],
  },
});

export type ISession = InferSchemaType<typeof SessionSchema>;

export default mongoose.model("Session", SessionSchema, "shopify_sessions");
