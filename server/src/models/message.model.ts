import { model, Schema, Types } from "mongoose";

export interface IUser {
  senderId?: Types.ObjectId;
  receiverId?: Types.ObjectId;
  text: string;
  image: string;
  seen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
const messageSchema = new Schema<IUser>(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = model<IUser>("Message", messageSchema);

export default Message;
