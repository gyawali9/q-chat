import { model, Schema, Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  profilePic: string;
  bio: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    profilePic: { type: String, default: "" },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
