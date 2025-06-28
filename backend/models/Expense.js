const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Expense", expenseSchema);
