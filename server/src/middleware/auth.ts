import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import User from "../models/user.model";
import { ApiError } from "../lib/apiError";

export const protectRoute: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized - No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== "object" || !("userId" in decoded)) {
      throw new ApiError(401, "Invalid token payload");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new ApiError(401, "Token expired"));
    } else if (
      error instanceof JsonWebTokenError ||
      error instanceof NotBeforeError
    ) {
      next(new ApiError(401, "Invalid token"));
    } else {
      next(
        new ApiError(
          500,
          "Something went wrong",
          [],
          error instanceof Error ? error.stack : ""
        )
      );
    }
  }
};
