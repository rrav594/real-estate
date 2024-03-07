import express from "express";
import {
  deleteUser,
  updateUserInfo,
  getUserListing,
  getUser,
} from "../controllers/user.controller.js";

import verifyToken from "../utils/verifyUser.js";
//create userRouter
const router = express.Router();

router.post("/update/:id", verifyToken, updateUserInfo);

router.delete("/delete/:id", verifyToken, deleteUser);

router.get("/listings/:id", verifyToken, getUserListing);

router.get("/:id", verifyToken, getUser);

export default router;
