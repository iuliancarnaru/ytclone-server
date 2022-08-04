import * as argon2 from "argon2";
import { createError } from "../error.js";
import User from "../models/User.js";

export const signup = async (req, res, next) => {
  try {
    const hashedPassword = await argon2.hash(req.body.password);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ message: "User has been created" });
  } catch (error) {
    next(error);
  }
};
