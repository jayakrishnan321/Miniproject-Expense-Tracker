// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/users/register", form);
            alert("Registered successfully!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.msg || "Error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                <input
                    className="w-full p-2 mb-4 border rounded"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
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
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Register
                </button>
                <button className="mt-1" onClick={() => navigate('/login')}>Already have account</button>
            </form>
        </div>
    );
}

export default Register;
