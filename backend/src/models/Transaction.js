import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  balance_after: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model("Transaction", TransactionSchema);
