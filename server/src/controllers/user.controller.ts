import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
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

//  Utility: create both tokens
const createTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Refresh Token Controller
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, "Refresh token missing");

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    if (typeof decoded !== "object" || !("userId" in decoded)) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) throw new ApiError(401, "User not found");

    const { accessToken } = createTokens(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        token: accessToken,
        user,
      },
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Refresh token expired"));
    }
    return next(new ApiError(401, "Invalid refresh token"));
  }
};

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
    const { accessToken, refreshToken } = createTokens(newUser._id.toString());

    // Get user without password
    const userToSend = await User.findById(newUser._id).select("-password");

    // Set HTTP-only refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: userToSend,
        token: accessToken,
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

    const { accessToken, refreshToken } = createTokens(user._id.toString());

    const userData = await User.findById(user._id).select("-password");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        user: userData,
        token: accessToken,
      },
      message: "Login Successful",
    });
  } catch (error) {
    throw error;
  }
};

// controller to check if user is authenticated
export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    if (!user) {
      throw new ApiError(401, "User not found");
    }
    res.status(200).json({
      success: true,
      data: {
        user,
      },
      message: "User is authenticated",
    });
  } catch (error) {
    next(error);
  }
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
