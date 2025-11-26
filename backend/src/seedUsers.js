import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Account from "./models/Account.js";
dotenv.config();

const seed = async () => {
  await connectDB();

  const users = [
    {
      username: "client1",
      email: "clientone@gmail.com",
      password: "Client@1",
      role: "customer",
      balance: 1000,
    },
    {
      username: "client2",
      email: "clientwo@gmail.com",
      password: "Client@2",
      role: "customer",
      balance: 500,
    },
    {
      username: "banker1",
      email: "bankerone@gmail.com",
      password: "Banker@1",
      role: "banker",
    },
  ];

  for (const u of users) {
    const existing = await User.findOne({ username: u.username });
    if (existing) {
      console.log("Already exists:", u.username);
      continue;
    }
    const hash = await bcrypt.hash(u.password, 10);
    const created = await User.create({
      username: u.username,
      email: u.email,
      password_hash: hash,
      role: u.role,
    });
    if (u.role === "customer") {
      await Account.create({ user_id: created._id, balance: u.balance || 0 });
    }
    console.log("Created:", u.username);
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
