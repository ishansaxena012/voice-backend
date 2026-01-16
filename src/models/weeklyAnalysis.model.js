import mongoose from "mongoose";

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

    summary: {
      type: String,
      required: true,
    },

    moodTrend: {
      type: String,
      required: true,
    },

    emotionalPattern: {
      type: String,
      required: true,
    },

    productivityTrend: {
      type: String,
      required: true,
    },

    positiveHabit: {
      type: String,
      required: true,
    },

    improvementFocus: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

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
