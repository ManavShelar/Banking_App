import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import AccessToken from "../models/AccessToken.js";
import dotenv from "dotenv";
dotenv.config();

const generate36CharToken = () => crypto.randomBytes(18).toString("hex");

export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = generate36CharToken();
    const ttlDays = parseInt(process.env.TOKEN_TTL_DAYS || "7", 10);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    await AccessToken.create({
      user_id: user._id,
      token,
      expires_at: expiresAt,
    });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
