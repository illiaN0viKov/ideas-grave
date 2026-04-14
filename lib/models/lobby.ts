import { Document, Types , Schema,  models, model, Model} from "mongoose";

export interface ILobby extends Document {
  name: string;
  description:string
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  inviteCode: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  
}

const LobbySchema = new Schema<ILobby>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim:true
    }, 

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index:true

    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    inviteCode: {
      type: String,
      required: true,
      unique: true,
      index:true
    },

    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);




export const Lobby: Model<ILobby> = models.Lobby || model<ILobby>("Lobby", LobbySchema);


