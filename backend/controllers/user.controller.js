import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export async function updateUserInfo(req, res, next) {
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "User not authenticated to update this account.")
    );
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    next(error);
  }
}
