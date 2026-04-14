import { Types } from "mongoose";

export type LobbyType = {
  _id: Types.ObjectId;

  name: string;
  description:string
  owner: Types.ObjectId;
  members: Types.ObjectId[];

  inviteCode: string;
  isPrivate: boolean;

  createdAt: Date;
  updatedAt: Date;
};

export type IdeaType = {
  _id: Types.ObjectId;

  title: string;
  description: string;

  lobby: Types.ObjectId;
  creator: Types.ObjectId;

  status: "active" | "abandoned" | "done";

  createdAt: Date;
  updatedAt: Date;
};