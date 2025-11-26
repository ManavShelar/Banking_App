import Account from "../models/Account.js";
import Transaction from "../models/Transaction.js";

export const deposit = async (req, res, next) => {
  try {
    console.log(
      "[deposit] req.user=",
      req.user?.id || req.user?._id,
      "body=",
      req.body
    );

    const { amount } = req.body;
    if (amount === undefined || amount === null) {
      return res.status(400).json({ message: "Missing amount" });
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const userId = req.user.id || req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updated = await Account.findOneAndUpdate(
      { user_id: userId },
      {
        $inc: { balance: num },
        $setOnInsert: { currency: "INR" },
        $set: { updated_at: new Date() },
      },
      { new: true, upsert: true }
    ).lean();

    await Transaction.create({
      account_id: updated._id,
      type: "deposit",
      amount: num,
      balance_after: updated.balance,
      description: "Customer deposit",
    });

    console.log(
      "[deposit] success for user",
      userId,
      "newBalance=",
      updated.balance
    );
    return res.json({ message: "Deposit success", balance: updated.balance });
  } catch (err) {
    console.error("[deposit] error:", err && (err.stack || err));
    next(err);
  }
};

export const withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || isNaN(amount) || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const userId = req.user.id || req.user._id;
    const updated = await Account.findOneAndUpdate(
      { user_id: userId, balance: { $gte: Number(amount) } },
      { $inc: { balance: -Number(amount) }, $set: { updated_at: new Date() } },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(400).json({ message: "Insufficient Funds" });
    }

    await Transaction.create({
      account_id: updated._id,
      type: "withdraw",
      amount: Number(amount),
      balance_after: updated.balance,
      description: "Customer withdrawal",
    });

    return res.json({
      message: "Withdrawal success",
      balance: updated.balance,
    });
  } catch (err) {
    console.error("withdraw error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const account = await Account.findOne({ user_id: userId }).lean();
    if (!account) return res.status(404).json({ message: "Account not found" });

    const transactions = await Transaction.find({ account_id: account._id })
      .sort({ created_at: -1 })
      .lean();
    return res.json({ account, transactions });
  } catch (err) {
    console.error("getTransactions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
