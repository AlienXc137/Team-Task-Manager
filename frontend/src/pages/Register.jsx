import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "member"
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    alert("Registered!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 text-white"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input placeholder="Name"
          onChange={e => setForm({...form, name: e.target.value})}
          className="w-full mb-3 p-2 rounded bg-white/30"
        />

        <input placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})}
          className="w-full mb-3 p-2 rounded bg-white/30"
        />

        <input type="password" placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})}
          className="w-full mb-3 p-2 rounded bg-white/30"
        />

        <select
          onChange={e => setForm({...form, role: e.target.value})}
          className="w-full mb-4 p-2 rounded bg-white/30"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-white text-black p-2 rounded font-semibold">
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </motion.form>

    </div>
  );
}