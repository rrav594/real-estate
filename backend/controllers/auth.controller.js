import User from "../models/user.model.js";

export async function signup(req, res, next) {
  const { username, email, password, passwordConfirm } = req.body;
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });

    res.status(201).json({ message: "User created succesfully." });
  } catch (error) {
    next(error);
  }
}
