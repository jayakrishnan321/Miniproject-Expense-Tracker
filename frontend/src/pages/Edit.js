import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Edit() {
    const { id } = useParams(); // get id from URL
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");


    const [form, setForm] = useState({
        title: "",
        amount: "",
        date: "",
        type: "expense",
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get("http://localhost:5000/api/expenses", {
                headers: { Authorization: token },
            });
            const expense = res.data.find((e) => e._id === id);
            if (expense) {
                setForm({
                    title: expense.title,
                    amount: expense.amount,
                    date: expense.date.slice(0, 10),
                    type: expense.type,
                });
            }
        };
        fetchData();
    }, [id, token])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:5000/api/expenses/${id}`, form, {
            headers: { Authorization: token },
        });
        navigate("/home");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h2 className="text-xl font-bold mb-4">Edit Expense</h2>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-md mx-auto">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border rounded"
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Update
                </button>
            </form>
        </div>
    );
}

export default Edit;
