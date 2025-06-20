import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken, getErrorMessage } from "../lib/utils";
import { ApiError } from "../lib/apiError";
import cloudinary from "../lib/cloudinary";

// sign up new user
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      throw new ApiError(400, "Missing required fields");
    }

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
    res.status(201).json({
      success: true,
      userData: newUser,
      token,
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
    const user = await User.findOne({ email });

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
    res.status(200).json({
      success: true,
      userData: user,
      token,
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
    user: req.user,
  });
};

// controller to update user profile details
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic, fullName, bio } = req.body;

    const userId = req.user?._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
          fullName,
        },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }
    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    throw error;
  }
};
