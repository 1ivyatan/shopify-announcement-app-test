import mongoose, { Schema, InferSchemaType } from "mongoose";

const EventTrackSchema = new Schema({}, { strict: false, timestamps: true });

export type IEventTrack = InferSchemaType<typeof EventTrackSchema>;

export default mongoose.model("EventTrack", EventTrackSchema);
