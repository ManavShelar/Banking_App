import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: { type: String, enum: ["customer", "banker"], default: "customer" },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model("User", UserSchema);
