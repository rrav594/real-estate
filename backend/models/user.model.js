import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username must be specified."],
      // unique: [true, "Username already exists. Select a unique username."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Account already exist with this email."],
      lowercase: true,
      validate: [validator.isEmail, "Please provide valid email."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Please confirm your password.",
      },
    },
    avatar: {
      type: String,
      default:
        "https://gravatar.com/avatar/d04a6521420f68da15e0a66b21d1eb63?s=200&d=robohash&r=x",
    },
  },
  { timestamps: true }
);

// save hashed password to the DB before saving the document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (password, validPassword) {
  return await bcrypt.compare(password, validPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
