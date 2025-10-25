// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/users/login", form);
            sessionStorage.setItem("token", res.data.token);
            alert("Login successful");
            navigate("/Home");
        } catch (err) {
            alert(err.response?.data?.msg || "Login error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <input
                    className="w-full p-2 mb-4 border rounded"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="w-full p-2 mb-4 border rounded"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
                    Login
                </button>
                <button className="mt-1" onClick={() => navigate("/")}>create account</button>
            </form>
        </div>
    );
}

export default Login;
