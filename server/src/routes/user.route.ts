import express from "express";
import {
  checkAuth,
  login,
  refreshToken,
  signUp,
  updateProfile,
} from "../controllers/user.controller";
import { protectRoute } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);

userRouter.get("/refresh-token", refreshToken);

userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;
