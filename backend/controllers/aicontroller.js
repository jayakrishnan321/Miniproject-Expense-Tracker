const OpenAI = require("openai");
const Expense = require("../models/Expense");
require("dotenv").config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.aicontroller = async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    // Fetch user's data from MongoDB
    const expenses = await Expense.find({ user: userId });

    const userData = {
      expenses: expenses.map(e => ({
        title: e.title,
        amount: e.amount,
        category: e.type,
        date: e.date,
      })),
    };

    const inputText = `You are a financial assistant. Analyze the user's expenses and answer clearly.
User Data: ${JSON.stringify(userData)}
User Question: ${prompt}`;

    // Call OpenAI Chat API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful financial assistant." },
        { role: "user", content: inputText },
      ],
      max_tokens: 500,
    });

    const reply = response.choices?.[0]?.message?.content || "No response generated.";
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ msg: "Error processing AI request" });
  }
};
