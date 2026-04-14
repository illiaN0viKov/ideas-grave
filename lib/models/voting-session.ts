import { Schema, model, models, Model, Types, Document } from "mongoose";

export interface IVotingSession extends Document {
  idea: Types.ObjectId;
  status: "active" | "ended";

  result: "pending" | "approved" | "rejected";

  createdAt: Date;
  updatedAt: Date;
}

const VotingSessionSchema = new Schema<IVotingSession>(
  {
    idea: {
      type: Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
      index: true,
    },

    result: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const VotingSession: Model<IVotingSession> = models.VotingSession || model<IVotingSession>("VotingSession", VotingSessionSchema);