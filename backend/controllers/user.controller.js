import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, username, password } = req.body;
  try {
    const user = await userService.createUser(email, username, password);

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });

    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ errors: "Invalid Credentials." });
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      return res.status(401).json({ errors: "Invalid Credentials." });
    }

    const token = user.generateJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });

    delete user._doc.password;

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ errors: error.message });
  }
};

export const profileController = async (req, res) => {
  res.status(200).json({ user: req.user });
};

export const logoutController = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").split(" ")[1];
    redisClient.set(token, "logged out", "EX", 60 * 60 * 24);

    res.cookie("token", "");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const authController = async (req, res) => {
  res.status(200).json({ user: req.user });
};