import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const users = await User.find().select("name email role");
  res.json(users);
});

export default router; 