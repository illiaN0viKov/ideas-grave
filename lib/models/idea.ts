import { Document, Types, Schema, models, model, Model } from "mongoose";

export interface IIdea extends Document {
  title: string;
  description: string;
  lobby: Types.ObjectId;
  creator: Types.ObjectId;
  status: "active" | "abandoned" | "done";
  createdAt: Date;
  updatedAt: Date;
}

const IdeaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    lobby: {
      type: Schema.Types.ObjectId,
      ref: "Lobby",
      required: true,
      index: true,
    },

    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "abandoned", "done"],
      default: "active",
      index: true, // useful later
    },
  },
  {
    timestamps: true,
  }
);

export const Idea: Model<IIdea> = models.Idea || model<IIdea>("Idea", IdeaSchema);