import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0.0,
  },
  currency: {
    type: String,
    default: "INR",
  },
  updated_at: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model("Account", AccountSchema);
