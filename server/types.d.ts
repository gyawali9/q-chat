import { Connection } from "mongoose";
import { UserDocument } from "./models/user.model";

declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
