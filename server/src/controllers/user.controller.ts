import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import { ApiError } from "../lib/apiError";
import cloudinary from "../lib/cloudinary";

// fields for updating
interface ProfileUpdateFields {
  fullName?: string;
  bio?: string;
  profilePic?: string;
}

// sign up new user
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password, bio } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !password || !bio) {
      throw new ApiError(400, "Missing required fields");
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // generate token
    const token = generateToken(newUser._id.toString());

    // Get user without password
    const userToSend = await User.findById(newUser._id).select("-password");
    res.status(201).json({
      success: true,
      data: {
        user: userToSend,
        token,
      },
      message: "Account Created Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// controller for login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    // check if user has registered
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const token = generateToken(user?._id.toString());
    const userData = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        token,
      },
      message: "Login Successful",
    });
  } catch (error) {
    throw error;
  }
};

// controller to check if user is authenticated
export const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
    message: "User is authenticated",
  });
};

// controller to update user profile details
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(401, "Unauthorized - User ID missing");
    }

    // let updatedUser;

    let updateFields: ProfileUpdateFields = { fullName, bio };
    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: {
        user: updatedUser,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
