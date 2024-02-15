import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

const app = express();

// connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(console.log("Connection established to database..."))
  .catch((error) => {
    console.log(error.message);
  });

// start listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
