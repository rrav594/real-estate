import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export async function updateUserInfo(req, res, next) {
  console.log(req.user);
  if (req.user._id !== req.params.id)
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
    console.log(updatedUser);
  } catch (error) {
    next(error);
  }
}
