import mongoose from "mongoose";

const ScanLogSchema = new mongoose.Schema(
  {
    uid: String,
    assetName: String,
    action: String,
    fromRoom: String,
    toRoom: String,
    time: String,
    date: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ScanLog ||
  mongoose.model("ScanLog", ScanLogSchema);