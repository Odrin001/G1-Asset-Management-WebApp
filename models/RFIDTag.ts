import mongoose from "mongoose";

const RFIDTagSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    assetName: {
      type: String,
      required: true,
    },

    currentRoom: {
      type: String,
      default: "Outside",
    },

    category: {
      type: String,
      default: "Furniture",
    },

    quantity: {
      type: Number,
      default: 1,
    },

    assetStatus: {
      type: String,
      default: "active",
    },

    condition: {
      type: String,
      default: "good",
    },

    description: {
      type: String,
      default: "",
    },

    dateRegistered: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RFIDTag ||
  mongoose.model("RFIDTag", RFIDTagSchema);