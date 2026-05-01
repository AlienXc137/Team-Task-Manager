import { useEffect, useState } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { Plus, Edit2, Users } from "lucide-react";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', members: [] });

    let user = null;
    try {
        const token = localStorage.getItem("token");
        if (token) user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) { console.error("Invalid token format"); }

    const fetchData = async () => {
        try {
            const [projRes, userRes] = await Promise.all([
                API.get("/projects"),
                API.get("/users")
            ]);
            setProjects(projRes.data);
            setUsers(userRes.data);
        } catch (err) {
            console.error("Failed to load data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateModal = () => {
        setEditingProject(null);
        setForm({ name: '', description: '', members: [] });
        setShowModal(true);
    };

    const openEditModal = (e, project) => {
        e.preventDefault();
        setEditingProject(project);
        setForm({
            name: project.name,
            description: project.description,
            // Safely extract the ID whether it was populated or not
            members: project.members?.map(u => u._id || u) || []
        });
        setShowModal(true);
    };

    const handleMemberChange = (userId) => {
        setForm((prev) => {
            const isMember = prev.members.includes(userId);
            if (isMember) {
                return { ...prev, members: prev.members.filter(id => id !== userId) };
            } else {
                return { ...prev, members: [...prev.members, userId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await API.put(`/projects/${editingProject._id}`, form);
            } else {
                await API.post("/projects", form);
            }
            setShowModal(false);
            fetchData(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save project");
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto pb-20 md:pb-0 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Projects</h1>
                        <p className="text-white/70 mt-1">Manage your team's projects.</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button onClick={openCreateModal} className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition font-semibold shrink-0">
                            <Plus size={18} /> New Project
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <Link key={project._id} to={`/projects/${project._id}`} className="relative flex flex-col justify-between bg-white/20 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-sm hover:bg-white/30 transition group">

                            {user?.role === 'admin' && (
                                <button
                                    onClick={(e) => openEditModal(e, project)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 text-white/80 rounded-lg hover:bg-black/40 hover:text-white transition z-10"
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}

                            <div>
                                <h3 className="text-xl font-bold group-hover:text-blue-200 transition pr-8">{project.name}</h3>
                                <p className="text-white/70 text-sm mt-2 line-clamp-2">{project.description}</p>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                                <Users size={14} />
                                {project.members?.length || 0} Members assigned
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
                                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                                <span className="bg-black/20 px-2 py-1 rounded text-white/80 border border-white/10">
                                    By: {project.createdBy?.name || "Admin"}
                                </span>
                            </div>
                        </Link>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full p-8 text-center text-white/60 bg-white/10 border border-white/20 border-dashed rounded-xl">
                            No projects found.
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-indigo-900/90 p-6 rounded-xl w-full max-w-md shadow-2xl border border-white/20">
                            <h2 className="text-xl font-bold mb-4 text-white">{editingProject ? "Edit Project" : "Create New Project"}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Project Name</label>
                                    <input required autoFocus type="text" className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
                                    <textarea required className="w-full p-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-1">Assign Members</label>
                                    <div className="max-h-28 overflow-y-auto space-y-2 p-2 bg-white/10 border border-white/30 rounded-lg custom-scrollbar">
                                        {users.map((u) => (
                                            <label key={u._id} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={form.members.includes(u._id)}
                                                    onChange={() => handleMemberChange(u._id)}
                                                    className="rounded border-white/40 bg-transparent text-blue-500 focus:ring-blue-400 cursor-pointer"
                                                />
                                                <span className="text-sm truncate text-white">{u.name} <span className="text-white/40 text-xs">({u.role})</span></span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100">
                                        {editingProject ? "Save Changes" : "Create"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}