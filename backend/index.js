import dotenv from "dotenv";
import express from "express";

dotenv.config({ path: "./config.env" });

const app = express();

// start listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});
