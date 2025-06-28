const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authmiddleware");

const {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense,


} = require("../controllers/expensecontroller");


router.use(authMiddleware); // 🔐 All routes protected


router.get("/", getExpenses);
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
