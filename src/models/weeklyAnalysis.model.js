import mongoose from "mongoose";

const encryptedPayloadSchema = new mongoose.Schema(
  {
    iv: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const weeklyAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    weekStart: {
      type: Date,
      required: true,
      index: true,
    },

    weekEnd: {
      type: Date,
      required: true,
    },

    //  Encrypted weekly AI output
    encryptedWeeklyAnalysis: {
      type: encryptedPayloadSchema,
      required: true,
    },

    // Safe metadata (NOT encrypted)
    entryCount: {
      type: Number,
      required: true,
      min: 1,
    },

    analysisVersion: {
      type: Number,
      default: 1,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent duplicate weekly analysis for same user & week
weeklyAnalysisSchema.index(
  { userId: 1, weekStart: 1 },
  { unique: true }
);

const WeeklyAnalysis = mongoose.model(
  "WeeklyAnalysis",
  weeklyAnalysisSchema
);

export default WeeklyAnalysis;
