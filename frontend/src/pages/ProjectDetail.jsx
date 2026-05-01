import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Layout from "../components/Layout";
import TaskModal from "../components/TaskModal";
import { Plus, ChevronLeft, Calendar, AlertCircle, Edit2, MessageSquare, ListFilter } from "lucide-react";

export default function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [openTaskModal, setOpenTaskModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // Filtering & Sorting State
    const [filterPriority, setFilterPriority] = useState("All");
    const [sortBy, setSortBy] = useState("dueDate");

    let user = null;
    try {
        const token = localStorage.getItem("token");
        if (token) user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) { }

    const fetchProjectData = async () => {
        try {
            const projRes = await API.get("/projects");
            setProject(projRes.data.find(p => p._id === id));
            const taskRes = await API.get("/tasks");
            setTasks(taskRes.data.filter(t => t.projectId === id));
        } catch (err) {
            console.error("Failed to load project details", err);
        }
    };

    useEffect(() => { fetchProjectData(); }, [id]);

    const updateStatus = async (taskId, status) => {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status } : t));
        await API.put(`/tasks/${taskId}`, { status });
        fetchProjectData();
    };

    const handleAddComment = async (e, taskId) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            try {
                await API.post(`/tasks/${taskId}/comments`, { text: e.target.value });
                e.target.value = '';
                fetchProjectData();
            } catch (err) {
                console.error("Failed to post comment", err);
            }
        }
    };

    const isOverdue = (task) => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) && task.status !== "done";
    };

    let displayedTasks = tasks;
    if (filterPriority !== "All") {
        displayedTasks = displayedTasks.filter(t => t.priority === filterPriority);
    }

    displayedTasks.sort((a, b) => {
        if (sortBy === "dueDate") return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
        if (sortBy === "priority") {
            const priorityWeights = { "High": 1, "Medium": 2, "Low": 3 };
            return priorityWeights[a.priority || "Medium"] - priorityWeights[b.priority || "Medium"];
        }
        return 0;
    });

    const columns = [
        { id: 'todo', label: 'To Do' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'done', label: 'Completed' }
    ];

    if (!project) return <Layout><div className="p-8 text-center text-white/70">Loading...</div></Layout>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto pb-20 md:pb-0 space-y-8">

                <Link to="/projects" className="flex items-center text-white/70 hover:text-white mb-2 transition w-max">
                    <ChevronLeft size={18} /> Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        <p className="text-white/70 mt-1">{project.description}</p>
                    </div>
                    {/* Removed Admin restriction so everyone can Add Tasks */}
                    <button onClick={() => { setTaskToEdit(null); setOpenTaskModal(true); }} className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition font-semibold shrink-0">
                        <Plus size={18} /> Add Task
                    </button>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                        <ListFilter size={16} /> Filters:
                    </div>
                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="text-sm bg-white/20 border border-white/30 rounded px-3 py-1.5 text-white outline-none cursor-pointer focus:bg-blue-600">
                        <option value="All" className="text-black">All Priorities</option>
                        <option value="High" className="text-black">High Priority</option>
                        <option value="Medium" className="text-black">Medium Priority</option>
                        <option value="Low" className="text-black">Low Priority</option>
                    </select>

                    <div className="flex items-center gap-2 text-sm text-white/80 ml-auto">
                        Sort By:
                    </div>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-white/20 border border-white/30 rounded px-3 py-1.5 text-white outline-none cursor-pointer focus:bg-blue-600">
                        <option value="dueDate" className="text-black">Due Date</option>
                        <option value="priority" className="text-black">Priority</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map(column => {
                        const columnTasks = displayedTasks.filter(t => t.status === column.id);
                        return (
                            <div key={column.id} className="bg-black/10 p-4 rounded-xl flex flex-col h-full min-h-[400px] border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">{column.label}</h3>
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">{columnTasks.length}</span>
                                </div>

                                <div className="space-y-3 flex-1">
                                    {columnTasks.map(task => (
                                        <div key={task._id} className={`relative bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-sm border ${isOverdue(task) ? 'border-red-400' : 'border-white/20'} flex flex-col gap-2 hover:bg-white/30 transition group`}>

                                            {user?.role === 'admin' && (
                                                <button onClick={() => { setTaskToEdit(task); setOpenTaskModal(true); }} className="absolute top-2 right-2 p-1.5 bg-black/20 text-white/80 rounded hover:bg-black/40 hover:text-white transition opacity-0 group-hover:opacity-100">
                                                    <Edit2 size={14} />
                                                </button>
                                            )}

                                            <div className="flex justify-between items-start gap-2 pr-8">
                                                <div>
                                                    <h4 className="font-medium leading-tight">{task.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border 
                              ${task.priority === 'High' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                                                task.priority === 'Low' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                                                    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'}`}>
                                                            {task.priority || 'Medium'}
                                                        </span>
                                                        <span className="text-[10px] text-white/50 tracking-wide">
                                                            BY {task.createdBy?.name?.toUpperCase() || "SYSTEM"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {isOverdue(task) && <span className="px-2 py-1 mt-1 text-[10px] uppercase tracking-wider font-bold rounded-full bg-red-500/20 text-red-200 border border-red-500/30 flex items-center gap-1 w-max"><AlertCircle size={10} /> Overdue</span>}

                                            <p className="text-sm text-white/70 line-clamp-2 my-1">{task.description}</p>

                                            <div className="bg-black/20 rounded-lg p-2 mt-2 space-y-2">
                                                <div className="max-h-20 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                                    {task.comments?.map((c, i) => (
                                                        <div key={i} className="text-[11px] leading-tight text-white/80">
                                                            <strong className="text-white">{c.user?.name || 'User'}:</strong> {c.text}
                                                        </div>
                                                    ))}
                                                </div>
                                                <input type="text" placeholder="Press enter to comment..." onKeyDown={(e) => handleAddComment(e, task._id)}
                                                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/50" />
                                            </div>

                                            <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between">
                                                <div className="flex flex-col gap-1 overflow-hidden pr-2">
                                                    <span className="text-xs font-medium text-white/90 truncate" title={Array.isArray(task.assignedTo) ? task.assignedTo.map(u => u.name).join(", ") : task.assignedTo?.name}>
                                                        {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 ? task.assignedTo.map(u => u.name).join(", ") : task.assignedTo?.name ? task.assignedTo.name : "Unassigned"}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-white/60">
                                                        <Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                                    </div>
                                                </div>
                                                <select className="text-xs bg-white/20 border border-white/30 rounded px-2 py-1 text-white outline-none cursor-pointer focus:bg-blue-600 shrink-0" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
                                                    <option value="todo" className="text-black">To Do</option>
                                                    <option value="in-progress" className="text-black">In Progress</option>
                                                    <option value="done" className="text-black">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {columnTasks.length === 0 && (
                                        <div className="text-center text-sm text-white/40 py-8 border-2 border-dashed border-white/20 rounded-lg">No tasks</div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {openTaskModal && <TaskModal setOpen={setOpenTaskModal} refresh={fetchProjectData} projectId={id} editingTask={taskToEdit} />}
            </div>
        </Layout>
    );
}