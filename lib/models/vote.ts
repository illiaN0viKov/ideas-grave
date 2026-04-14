import { Schema, model, models, Model, Types, Document } from "mongoose";

export interface IVote extends Document {
  idea: Types.ObjectId;
  session: Types.ObjectId;
  user: Types.ObjectId;

//   changeVote?: "up" | "down";
//   abandonVote?: "up" | "down";

  target: "change" | "abandon";
  value: "up" | "down";

  createdAt: Date;
  updatedAt: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    idea: {
      type: Schema.Types.ObjectId,
      ref: "Idea",
      required: true,
      index: true,
    },

    session: {
      type: Schema.Types.ObjectId,
      ref: "VotingSession",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // changeVote: {
    //   type: String,
    //   enum: ["up", "down"],
    //   required: true,
    //   default:null
    // },

    // abandonVote: {
    //   type: String,
    //   enum: ["up", "down"],
    //   required: true,
    //     default:null

    // },

        target: {
      type: String,
      enum: ["change", "abandon"],
      required: true,
    },

    value: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * One vote per user per session
 */
VoteSchema.index({ session: 1, user: 1 }, { unique: true });

export const Vote: Model<IVote> = models.Vote || model<IVote>("Vote", VoteSchema);