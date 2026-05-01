import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderKanban, AlertCircle } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "member"
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); //Error state for validation
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //Frontend Validation
    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required.");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError("Please enter a valid email address.");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);
      await API.post("/auth/register", form);
      
      // Optionally auto-login the user here, or just redirect to login
      navigate("/");
    } catch (err) {
      // Catch backend validation errors (like "Email already in use")
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20 text-white"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center mb-6 text-white">
          <FolderKanban size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/*Error Banner */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
              className="w-full p-2 border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com"
              className="w-full p-2 border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
              className="w-full p-2 border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-white/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white/80">Account Type</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full p-2 border border-white/30 rounded-lg bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="member" className="text-black">Member</option>
              <option value="admin" className="text-black">Admin</option>
            </select>
          </div>

          <button disabled={loading} className="w-full bg-white text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition font-semibold mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </div>

        <p className="text-sm mt-6 text-center text-white/80">
          Already have an account?{" "}
          <Link to="/" className="text-white font-bold hover:underline">Sign In</Link>
        </p>
      </motion.form>
    </div>
  );
}