import express from "express";
import { protectRoute } from "../middleware/auth";
import {
  getMessages,
  getUsersForSidebar,
  MarkMessageAsSeen,
  sendMessage,
} from "../controllers/message.controller";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, MarkMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
