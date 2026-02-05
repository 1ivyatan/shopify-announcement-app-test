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
    type: String,
    required: [true, "Text is required"],
  },
  fgColor: {
    type: String,
    required: [true, "Foregound color is required"],
  },
  bgColor: {
    type: String,
    required: [true, "Background color is required"],
  },
  fontSize: {
    type: Number,
    required: [true, "Font size is required"],
    default: 16
  },
  views: {
    type: Number,
    required: [true, "Count is required"],
    default: 0
  }
}, { timestamps: true });

export type IAnnouncement = InferSchemaType<typeof AnnouncementSchema>;

export default mongoose.model("Announcement", AnnouncementSchema);