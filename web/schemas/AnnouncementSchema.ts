import mongoose, { Schema, InferSchemaType } from "mongoose";

export const AnnouncementSchema = new Schema({
  id: {
    type: String,
    required: [true, "Id is required"],
  },
  shop: {
    type: String,
    required: [true, "Shop name is required"],
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
});

export type IAnnouncement = InferSchemaType<typeof AnnouncementSchema>;

export default mongoose.model("Announcement", AnnouncementSchema);
