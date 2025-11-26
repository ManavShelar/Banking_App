import AccessToken from "../models/AccessToken.js";
import User from "../models/User.js";

export default async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ message: "Missing Authorization header" });

    const token = header.replace(/^Bearer\s+/i, "").trim();
    if (!token)
      return res.status(401).json({ message: "Invalid token format" });

    const tokenRec = await AccessToken.findOne({ token }).lean();
    if (!tokenRec) return res.status(401).json({ message: "Invalid token" });

    if (tokenRec.expires_at && new Date(tokenRec.expires_at) < new Date()) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(tokenRec.user_id)
      .select("-password_hash")
      .lean();
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.tokenRecord = tokenRec;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
