import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllAccounts, getUserTransactions } from "../controllers/bankerController.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/accounts", getAllAccounts);
router.get("/accounts/:userId/transactions", getUserTransactions);

export default router;
