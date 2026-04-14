import { Document, Types, Schema, model, models, Model } from "mongoose";

export interface ISuggestion extends Document {
  idea: Types.ObjectId;
  author: Types.ObjectId;
  content: string;

  createdAt: Date;
  updatedAt: Date;
}

const SuggestionSchema = new Schema<ISuggestion>(
  {
    idea: {
      type: Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Suggestion: Model<ISuggestion> = models.Suggestion || model<ISuggestion>("Suggestion", SuggestionSchema);