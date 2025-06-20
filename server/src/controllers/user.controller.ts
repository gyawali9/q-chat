import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken, getErrorMessage } from "../lib/utils.js";

// sign up new user
export const signUp = async (req: Request, res: Response) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({
        status: false,
        message: "Missing Details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        status: false,
        message: "User aleady exists",
      });
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
    res.json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// controller for login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // check if user has registered
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    // check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({
        status: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(user?._id.toString());
    res.status(200).json({
      success: true,
      userData: user,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    res.json({
      success: false,
      message: getErrorMessage(error),
    });
  }
};

// controller to check if user is authenticated
export const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
