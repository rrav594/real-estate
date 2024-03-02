import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.router.js";
import listingRouter from "./routes/listing.router.js";

dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// create APIs
app.use("/api/user", userRouter);

app.use("/api/auth", authRouter);

app.use("/api/listing", listingRouter);

// error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({ status: "fail", statusCode, message });
});

// connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(console.log("Connection established to database..."))
  .catch((error) => {
    console.log(error.message);
  });

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
