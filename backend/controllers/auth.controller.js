import jwt from "jsonwebtoken";
import generator from "generate-password";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export async function signup(req, res, next) {
  try {
    const { username, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    createSendToken(newUser, 200, req, res);
  } catch (error) {
    next(error);
  }
}

export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "Please provide email and password!"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(errorHandler(401, "Incorrect email or password."));
    }

    createSendToken(user, 200, req, res);
  } catch (error) {
    next(error);
  }
}

function createSendToken(user, statusCode, req, res) {
  const token = signToken(user.id);

  res.cookie("jwt", token, {
    // expires: new Date(
    //   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    // ),
    httpOnly: true,
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

function signToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET_KEY
    // {
    // expiresIn: process.env.JWT_EXPIRES_IN,
    // }
  );
}

export async function google(req, res, next) {
  try {
    const { email, name, photoURL } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      createSendToken(user, 200, req, res);
    } else {
      const generatedPassword = generator.generate({
        length: 8,
        numbers: true,
      });

      const user = await User.create({
        username: name.split(" ").join("").toLowerCase(),
        email: email,
        password: generatedPassword,
        passwordConfirm: generatedPassword,
        avatar: photoURL,
      });
      createSendToken(user, 200, req, res);
    }
  } catch (error) {
    next(error);
  }
}
