const Expense = require("../models/Expense");


exports.addExpense = async (req, res) => {
  const { title, amount, date, type } = req.body;
  try {
    const newExpense = new Expense({ title, amount, date, type, user: req.user });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ msg: "Error adding expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching expenses" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting expense" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, date, type } = req.body;

    // Find the expense by ID and ensure it belongs to the logged-in user
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { title, amount, date, type },
      { new: true } // Return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ msg: "Expense not found or unauthorized" });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error while updating expense" });
  }
};

