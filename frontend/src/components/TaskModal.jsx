import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";

export default function TaskModal({ setOpen, refresh, projectId, editingTask }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "Medium",
    assignedTo: [],
    dueDate: ""
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔴 Extract user role safely
  let user = null;
  try {
    const token = localStorage.getItem("token");
    if (token) user = JSON.parse(atob(token.split('.')[1]));
  } catch (e) { }

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => console.log("Failed to load users"));

    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "todo",
        priority: editingTask.priority || "Medium",
        assignedTo: editingTask.assignedTo?.map(u => u._id) || [],
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ""
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssigneeChange = (userId) => {
    setForm((prev) => {
      const isAssigned = prev.assignedTo.includes(userId);
      if (isAssigned) {
        return { ...prev, assignedTo: prev.assignedTo.filter(id => id !== userId) };
      } else {
        return { ...prev, assignedTo: [...prev.assignedTo, userId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 Updated validation: Members don't need to select an assignee manually
    if (!form.title) {
      return alert("Title is required");
    }
    if (user?.role === 'admin' && form.assignedTo.length === 0) {
      return alert("Please assign at least one user");
    }

    try {
      setLoading(true);

      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, form);
      } else {
        await API.post("/tasks", { ...form, projectId });
      }

      refresh();
      setOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onSubmit={handleSubmit}
        className="bg-indigo-900/90 border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        <h2 className="text-xl font-bold mb-6">{editingTask ? "Edit Task" : "Create New Task"}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Task Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="w-full p-2 bg-white/10 border border-white/30 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* 🔴 Only show Assign To box if the user is an Admin */}
            {user?.role === 'admin' ? (
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Assign To</label>
                <div className="max-h-24 overflow-y-auto space-y-2 p-2 bg-white/10 border border-white/30 rounded-lg custom-scrollbar">
                  {users.map((u) => (
                    <label key={u._id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.assignedTo.includes(u._id)}
                        onChange={() => handleAssigneeChange(u._id)}
                        className="rounded border-white/40 bg-transparent text-blue-500 focus:ring-blue-400 cursor-pointer"
                      />
                      <span className="text-sm truncate">{u.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center bg-white/5 border border-white/10 rounded-lg p-2 text-center text-sm text-white/60">
                This task will automatically be assigned to you.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Due Date</label>
                <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
                  className="w-full p-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" style={{ colorScheme: 'dark' }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full p-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="todo" className="text-black">To Do</option>
                <option value="in-progress" className="text-black">In Progress</option>
                <option value="done" className="text-black">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}
                className="w-full p-2 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="Low" className="text-black">Low</option>
                <option value="Medium" className="text-black">Medium</option>
                <option value="High" className="text-black">High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100">
            {loading ? "Saving..." : (editingTask ? "Save Changes" : "Create Task")}
          </button>
        </div>
      </motion.form>
    </div>
  );
}