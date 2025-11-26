import mongoose from "mongoose";

const AccessTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: Date,
    default: () => new Date(),
  },
  expires_at: {
    type: Date,
  },
});

export default mongoose.model("AccessToken", AccessTokenSchema);
