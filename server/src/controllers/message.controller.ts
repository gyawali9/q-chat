import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import { ApiError } from "../lib/apiError";
import cloudinary from "../lib/cloudinary";
import { io, userSocketmap } from "../../server";

// get all users except logged in user
export const getUsersForSidebar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // we will add the middle before this endpint
    // user data is added in request
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    // filter users from all user list
    // we exclude this user
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );
    // count no of messages not seen
    const unseenMessages: Record<string, number> = {};

    const promises = filteredUsers.map(async (user) => {
      const id = user?._id.toString();
      const messages = await Message.find({
        senderId: user.id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.status(200).json({
      success: true,
      data: {
        users: filteredUsers,
        unseenMessages,
      },
      message: "Users fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET MESSAGES BETWEEN USERS
// get all messages fof selected user
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // receive selected userid from apiparams
    // const { id: selectedUserId } = req.params;
    const selectedUserId = req.params.id;
    // logged in userid
    const myId = req.user?._id;

    if (!myId) {
      throw new ApiError(401, "Unauthorized");
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
      },
      {
        seen: true,
      }
    );
    res.status(200).json({
      success: true,
      data: messages,
      message: "Messages fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({
      success: true,
      data: null,
      message: "Message marked as seen",
    });
  } catch (error) {
    next(error);
  }
};

// send message to selected user

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user?._id;

    if (!receiverId || typeof receiverId !== "string") {
      throw new ApiError(400, "Receiver ID is required");
    }

    if (!req.body.text && !req.body.image) {
      throw new ApiError(400, "Either text or image is required");
    }

    let imageUrl;
    if (req.body?.image) {
      const image = req.body.image;
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: req.body?.text,
      image: imageUrl,
    });

    // Emit the new message to the receivers socket
    const receiverSocketId = userSocketmap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};
