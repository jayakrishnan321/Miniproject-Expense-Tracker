import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Home() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: "",
        amount: "",
        date: "",
        type: "expense",
    });
    const [userName, setUserName] = useState("");
    const [expenses, setExpenses] = useState([]);
    const token = localStorage.getItem("token");
    const [filters, setFilters] = useState({
        type: 'all',
        month: 'all',
        search: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/users/user", {
                    headers: { Authorization: token },
                });
                console.log(res.data.name)
                setUserName(res.data.name);
            } catch (err) {
                console.error("Failed to load user");
            }
        };

        fetchUser();

    }, [token])

    const fetchExpenses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/expenses", {
                headers: { Authorization: token },
            });
            setExpenses(res.data);

        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    fetchExpenses();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post("http://localhost:5000/api/expenses", form, {
                headers: { Authorization: token },
            });

            setForm({ title: "", amount: "", date: "", type: "expense" });
            fetchExpenses();
        } catch (err) {
            alert("Error saving expense");
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
            headers: { Authorization: token },
        });
        fetchExpenses();
    };


    const handleedit = (id) => {
        navigate(`/edit/${id}`)
    }
    const handleLogout = () => {
        localStorage.removeItem('token'); // ❌ Clear token
        navigate('/login'); // 🔁 Redirect to login page
    };
    const filteredExpenses = expenses.filter((exp) => {
        const matchType = filters.type === 'all' || exp.type === filters.type;

        const matchMonth =
            filters.month === 'all' ||
            new Date(exp.date).getMonth() + 1 === parseInt(filters.month);

        const matchSearch = exp.title.toLowerCase().includes(filters.search.toLowerCase());

        return matchType && matchMonth && matchSearch;
    });
    const filteredTotal = filteredExpenses.reduce((acc, item) => {
        return item.type === 'income' ? acc + item.amount : acc - item.amount;
    }, 0);
    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">
                Welcome, {userName} 👋
            </h1>
            <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>

            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="p-2 border rounded"
                        required
                    />
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="p-2 border rounded"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add
                </button>
                <div className="flex flex-wrap justify-end gap-3 mb-4">
                    {/* Filter by type */}
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="border px-3 py-1 rounded"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    {/* Filter by month */}
                    <select
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                        className="border px-3 py-1 rounded"
                    >
                        <option value="all">All Months</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    {/* Search input */}
                    <input
                        type="text"
                        placeholder="Search title..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="border px-3 py-1 rounded"
                    />
                </div>
            </form>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                <table className="w-full border table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="p-2 border align-middle">Title</th>
                            <th className="p-2 border align-middle">Amount</th>
                            <th className="p-2 border align-middle">Date</th>
                            <th className="p-2 border align-middle">Type</th>
                            <th className="p-2 border align-middle">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp) => (
                            <tr key={exp._id} className="text-center">
                                <td className="p-2 border align-middle">{exp.title}</td>
                                <td className="p-2 border align-middle">₹{exp.amount}</td>
                                <td className="p-2 border align-middle">
                                    {new Date(exp.date).toLocaleDateString()}
                                </td>
                                <td className="p-2 border align-middle">
                                    <span
                                        className={`px-2 py-1 text-sm rounded ${exp.type === "income"
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                            }`}
                                    >
                                        {exp.type}
                                    </span>
                                </td>
                                <td className="p-2 border align-middle">
                                    <button
                                        onClick={() => handleedit(exp._id)}
                                        className="mr-2 text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp._id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-right mt-4 font-bold text-lg">
                    Total Balance: ₹{filteredTotal}
                </div>
            </div>
            <button
                onClick={() => navigate("/changepassword")}
                className="mt-5 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
                Change Password
            </button>
            <button
                onClick={handleLogout}
                className="ml-4 mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}

export default Home;
