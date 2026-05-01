import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import { FolderKanban, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";

const StatusBadge = ({ status, overdue }) => {
  if (overdue) return (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-200 border border-red-500/30 flex items-center gap-1 w-max">
      <AlertCircle size={12} /> Overdue
    </span>
  );

  const styles = {
    'todo': 'bg-white/10 text-white border-white/20',
    'in-progress': 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    'done': 'bg-green-500/20 text-green-200 border-green-500/30',
  };

  const displayNames = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Completed'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border w-max ${styles[status] || styles['todo']}`}>
      {displayNames[status] || 'To Do'}
    </span>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [recentTasks, setRecentTasks] = useState([]);

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && task.status !== "done";
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      const fetchedTasks = res.data;

      const completed = fetchedTasks.filter(t => t.status === 'done').length;
      const overdue = fetchedTasks.filter(t => isOverdue(t)).length;

      setStats({
        total: fetchedTasks.length,
        completed,
        pending: fetchedTasks.length - completed,
        overdue
      });

      setRecentTasks([...fetchedTasks].reverse().slice(0, 5));
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-white/70 mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''}. Here is your overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tasks', value: stats.total, icon: FolderKanban, color: 'text-blue-200', bg: 'bg-white/10' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-300', bg: 'bg-white/10' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-300', bg: 'bg-white/10' },
            { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-red-300', bg: 'bg-white/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-white/70 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {stats.overdue > 0 && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-lg font-bold text-red-200 flex items-center gap-2 mb-4">
              <AlertCircle size={20} /> Action Required: Overdue Tasks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTasks.filter(t => isOverdue(t)).map(task => (
                <div key={task._id} className="bg-white/10 p-3 rounded-lg border border-red-500/30 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <span className="text-xs text-red-200 block mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <Link to={`/projects/${task.projectId}`} className="text-xs bg-white/20 px-3 py-1.5 rounded-lg text-white hover:bg-white/30">
                    View Project
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-sm mt-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-lg font-semibold text-white">Recent Tasks Overview</h2>
          </div>
          <div className="divide-y divide-white/10">
            {recentTasks.length === 0 ? (
              <p className="p-6 text-white/50 text-center">No recent tasks found.</p>
            ) : (
              recentTasks.map(task => (
                <div key={task._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/5 transition">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-white">{task.title}</h3>
                      <span className="text-[10px] uppercase tracking-wider bg-white/10 text-white/70 px-2 py-0.5 rounded border border-white/10">
                        By {task.createdBy?.name || "System"}
                      </span>
                    </div>
                    <div className="text-sm text-white/60 mt-1 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                      </span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]" title={Array.isArray(task.assignedTo) ? task.assignedTo.map(u => u.name).join(", ") : task.assignedTo?.name}>
                        {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                          ? task.assignedTo.map(u => u.name).join(", ")
                          : task.assignedTo?.name
                            ? task.assignedTo.name
                            : "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    <StatusBadge status={task.status} overdue={isOverdue(task)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}