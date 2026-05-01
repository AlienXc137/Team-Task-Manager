import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { FolderKanban } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return alert("Please fill all fields");

    try {
      setLoading(true);
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20 text-white">

        <div className="flex justify-center mb-6 text-white">
          <FolderKanban size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full p-2 border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
              placeholder="Enter your email" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="w-full p-2 border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
              placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-white text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition font-semibold mt-2">
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </div>

        <p className="text-sm text-center mt-6 text-white/80">
          Don’t have an account?{" "}
          <Link to="/register" className="text-white font-bold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}