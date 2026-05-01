import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
    const { name, description, members } = req.body;

    try {
        const project = await Project.create({
            name,
            description,
            members: Array.isArray(members) ? members : [], 
            createdBy: req.user.id
        });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Failed to create project" });
    }
};

export const getProjects = async (req, res) => {
    try {
        // 1. Admins see absolutely everything
        if (req.user.role === "admin") {
            const projects = await Project.find()
                .populate("members", "name role")
                .populate("createdBy", "name");
            return res.json(projects);
        }

        // 2. Members see projects they are added to OR projects where they have tasks
        const userTasks = await Task.find({ assignedTo: req.user.id });
        
        // Extract project IDs safely, filtering out any nulls
        const projectIdsFromTasks = userTasks
            .map(t => t.projectId)
            .filter(id => id != null); 

        const projects = await Project.find({
            $or: [
                { members: req.user.id }, // Explicitly assigned members
                { _id: { $in: projectIdsFromTasks } } // Implicitly assigned via task
            ]
        })
        .populate("members", "name role")
        .populate("createdBy", "name");

        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching projects" });
    }
};

export const updateProject = async (req, res) => {
    const { name, description, members } = req.body;

    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { 
                name, 
                description, 
                members: Array.isArray(members) ? members : [] 
            },
            { new: true }
        );

        if (!project) return res.status(404).json({ message: "Project not found" });
        
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Failed to update project" });
    }
};