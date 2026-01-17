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

const diarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔐 Encrypted AI analysis (summary, mood, emotions, insight, etc.)
    encryptedAnalysis: {
      type: encryptedPayloadSchema,
      required: true,
    },

    // keep time — important for ordering multiple entries
    entryDate: {
      type: Date,
      required: true,
      index: true,
      default: Date.now,
    },

    // helps if AI logic changes in future
    analysisVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Fast timeline queries
diarySchema.index({ userId: 1, entryDate: -1 });

const Diary = mongoose.model("Diary", diarySchema);
export default Diary;
