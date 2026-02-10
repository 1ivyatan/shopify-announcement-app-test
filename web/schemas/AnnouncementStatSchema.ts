import mongoose, { Schema, InferSchemaType } from "mongoose";

export const AnnouncementStatSchema = new Schema({
  shop: {
    type: String,
    required: [true, "Shop name is required"],
  },
  announcementId: {
    type: String,
    required: [true, "Id is required"],
  },
  views: {
    type: Number,
    required: [true, "Count is required"],
    default: 0
  }
}, { timestamps: true });

export type IAnnouncementStat = InferSchemaType<typeof AnnouncementStatSchema>;

export default mongoose.model("AnnouncementStat", AnnouncementStatSchema);