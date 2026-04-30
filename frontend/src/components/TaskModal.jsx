import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function TaskModal({ setOpen, refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    assignedTo: ""
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // fetch users for assignment
  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => console.log("Failed to load users"));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.assignedTo) {
      return alert("Title and assigned user required");
    }

    try {
      setLoading(true);

      await API.post("/tasks", form);

      refresh();     // reload tasks
      setOpen(false); // close modal

    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

      <motion.form
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-96 text-white"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Task
        </h2>

        {/* Task Title */}
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-white/30 placeholder-white"
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-white/30 placeholder-white"
        />

        {/* Assign User */}
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          className="w-full mb-3 p-2 rounded bg-white/30 text-black"
        >
          <option value="">Select Member</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-white/30 text-black"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black p-2 rounded font-semibold hover:bg-gray-200 transition"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full text-red-300 hover:text-red-500"
        >
          Cancel
        </button>
      </motion.form>

    </div>
  );
}