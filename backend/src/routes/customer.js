import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getTransactions,
  deposit,
  withdraw,
} from "../controllers/customerController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/transactions", getTransactions);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

export default router;
