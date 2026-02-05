import mongoose, { Schema, InferSchemaType } from "mongoose";

export const AnnouncementSchema = new Schema({
  shop: {
    type: String,
    required: [true, "Shop name is required"],
  },
  label: {
    type: String,
    required: [true, "Label is required"],
  },
  enabled: {
    type: Boolean,
    required: [true, "Enabled is required"],
  },
  text: {
    type: String
  },
  fgColor: {
    type: String
  },
  bgColor: {
    type: String
  },
  fontSize: {
    type: Number
  }
}, { timestamps: true });

export type IAnnouncement = InferSchemaType<typeof AnnouncementSchema>;

export default mongoose.model("Announcement", AnnouncementSchema);