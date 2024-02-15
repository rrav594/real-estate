import express from "express";
import { test } from "../controllers/user.controller.js";

//create userRouter
const router = express.Router();

router.get("/health", test);

export default router;
