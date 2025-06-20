import { Connection } from "mongoose";
import { IUser } from "./src/models/user.model";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export {};
