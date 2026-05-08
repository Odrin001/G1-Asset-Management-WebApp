import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  dateRegistered: { type: String, required: true },
  dateRemoved: { type: String },
  rfidUid: { type: String },
  assetType: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  assetStatus: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);