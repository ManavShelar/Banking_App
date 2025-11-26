import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const getAllAccounts = async (req, res) => {
  try {
    if (req.user.role !== "banker")
      return res.status(403).json({ message: "Forbidden" });
    const accounts = await Account.find()
      .populate("user_id", "username email")
      .lean();
    return res.json({ accounts });
  } catch (err) {
    console.error("getAllAccounts error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserTransactions = async (req, res) => {
  try {
    if (req.user.role !== "banker")
      return res.status(403).json({ message: "Forbidden" });
    const { userId } = req.params;
    const account = await Account.findOne({ user_id: userId }).lean();
    if (!account) return res.status(404).json({ message: "Account not found" });

    const transactions = await Transaction.find({ account_id: account._id })
      .sort({ created_at: -1 })
      .lean();
    return res.json({ account, transactions });
  } catch (err) {
    console.error("getUserTransactions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
