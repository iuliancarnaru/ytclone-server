import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
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

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const validPassword = await argon2.verify(user.password, req.body.password);

    if (!validPassword) {
      return next(createError(400, "Wrong credentials"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...otherDetails } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 900000),
        // secure: true, // Marks the cookie to be used with HTTPS only.
      })
      .status(200)
      .json(otherDetails);
  } catch (error) {
    next(error);
  }
};
