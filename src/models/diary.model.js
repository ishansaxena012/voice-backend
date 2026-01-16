import mongoose from "mongoose";

const diarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    analysis: {
      summary: {
        type: String,
        required: true,
      },
      mood: {
        type: String,
        required: true,
      },
      emotions: {
        type: [String],
        required: true,
      },
      productivityScore: {
        type: Number,
        min: 1,
        max: 10,
        required: true,
      },
      insight: {
        type: String,
        required: true,
      },
    },

    entryDate: {
      type: Date,
      required: true,
      index: true,
    },

    // source: {
    //   type: String,
    //   enum: ["voice", "text"],
    //   default: "voice",
    // },

    isEdited: {
      type: Boolean,
      default: false,
    },

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

//  Critical for weekly queries
diarySchema.index({ userId: 1, entryDate: -1 });

const Diary = mongoose.model("Diary", diarySchema);
export default Diary;
