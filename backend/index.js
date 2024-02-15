import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import userRouter from "./routes/user.route.js";

dotenv.config({ path: "./config.env" });

const app = express();

// create APIs
app.use("/api/user", userRouter);

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
