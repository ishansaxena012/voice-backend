import { Router } from "express";
import User from "../models/user.model.js";
import { generateAccessToken } from "../config/jwt.config.js";

const router = Router();

router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: "dev@test.com" });

  if (!user) {
    user = await User.create({
      email: "dev@test.com",
      fullName: "Dev User",
      authProvider: "google",
      googleSub: "dev-google-sub-123", // ✅ REQUIRED
      isEmailVerified: true,
    });
  }

  const accessToken = generateAccessToken({ _id: user._id });

  res.json({
    success: true,
    accessToken,
    user,
  });
});

export default router;
