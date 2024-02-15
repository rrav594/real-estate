import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export async function signup(req, res) {
  const { username, email, password, passwordConfirm } = req.body;
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    res.status(201).json({ message: "User created succesfully." });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}
