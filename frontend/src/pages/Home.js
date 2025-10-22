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
    const token = sessionStorage.getItem("token");
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
        sessionStorage.clear()
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
            👋 Welcome, <span className="text-indigo-600">{userName}</span>
          </h1>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={() => navigate("/changepassword")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium shadow"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Form Section */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-10 border border-white/40">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Transaction</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button
              type="submit"
              className="col-span-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold mt-2 shadow-md"
            >
              + Add Transaction
            </button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-end mt-6">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
            >
              <option value="all">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="🔍 Search title..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/40">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">Transactions</h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-center border-collapse text-gray-700">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm uppercase tracking-wider">
                  <th className="p-3 border-r border-indigo-400">Title</th>
                  <th className="p-3 border-r border-indigo-400">Amount</th>
                  <th className="p-3 border-r border-indigo-400">Date</th>
                  <th className="p-3 border-r border-indigo-400">Type</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, i) => (
                  <tr
                    key={exp._id}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    } hover:bg-indigo-100 transition`}
                  >
                    <td className="p-3 border-b border-gray-200 font-medium">{exp.title}</td>
                    <td className="p-3 border-b border-gray-200 font-semibold text-indigo-700">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          exp.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {exp.type}
                      </span>
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      <button
                        onClick={() => handleedit(exp._id)}
                        className="text-blue-600 hover:underline mr-3 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="text-right mt-6 text-lg font-semibold text-gray-800">
            💰 Total Balance:{" "}
            <span
              className={`${
                filteredTotal >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{filteredTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
