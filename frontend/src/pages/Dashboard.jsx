import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModal";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <Navbar />

      <button
        onClick={() => setOpen(true)}
        className="mb-4 bg-white text-black px-4 py-2 rounded"
      >
        + Add Task
      </button>

      <div className="grid grid-cols-3 gap-4">
        {tasks.map(task => (
          <motion.div
            key={task._id}
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 backdrop-blur-md p-4 rounded-xl text-white"
          >
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
            <span className="text-xs">{task.status}</span>
          </motion.div>
        ))}
      </div>

      {open && <TaskModal setOpen={setOpen} refresh={fetchTasks} />}
    </div>
  );
}