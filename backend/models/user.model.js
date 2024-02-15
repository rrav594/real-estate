import mongoose from "mongoose";
import validator from "mongoose-validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username must be specified."],
      unique: [true, "Username already exists. Select a unique username."],
      validate: { validator: "isAlphanumeric" },
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Account already exist with this email."],
      validate: { validator: "isEmail" },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
