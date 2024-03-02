import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export async function updateUserInfo(req, res, next) {
  console.log(req.user, req.params);
  if (req.user.id !== req.params.id)
    return next(
      errorHandler(401, "User not authenticated to update this account....")
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

export async function deleteUser(req, res, next) {
  // console.log("Delete:", req.user, req.params);
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete your own account..."));
  }
  try {
    await User.findByIdAndDelete(req.params.id);

    res
      .clearCookie("jwt")
      .status(200)
      .json({ message: "User has been deleted..." });
  } catch (error) {
    next(error);
  }
}
