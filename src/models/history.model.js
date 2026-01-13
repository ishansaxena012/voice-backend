import mongoose from "mongoose";

const speakerSegmentSchema = new mongoose.Schema(
  {
    speaker: {
      type: String, // e.g. "SPEAKER_1"
      required: true,
    },
    startTime: {
      type: Number, // seconds
      required: true,
    },
    endTime: {
      type: Number, // seconds
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: null,
    },

    language: {
      type: String,
      default: "unknown",
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
      index: true,
    },

    transcript: {
      type: String,
      default: "",
    },

    speakers: {
      type: [speakerSegmentSchema],
      default: [],
    },

    error: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historySchema);

export default History;
