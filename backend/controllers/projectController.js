import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
    const project = await Project.create({
        ...req.body,
        createdBy: req.user.id
    });
    res.json(project);
};

export const getProjects = async (req, res) => {
    // 1. Admins see absolutely everything
    if (req.user.role === "admin") {
        const projects = await Project.find()
            .populate("members", "name")
            .populate("createdBy", "name");
        return res.json(projects);
    }

    // 2. Members see projects they are explicitly added to...
    // AND projects where they have been assigned a task!
    const userTasks = await Task.find({ assignedTo: req.user.id });
    const projectIdsFromTasks = userTasks.map(t => t.projectId);

    const projects = await Project.find({
        $or: [
            { members: req.user.id }, 
            { _id: { $in: projectIdsFromTasks } }
        ]
    })
    .populate("members", "name")
    .populate("createdBy", "name");

    res.json(projects);
};

export const updateProject = async (req, res) => {
    const project = await Project.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true } // Returns the updated document
    );

    if (!project) return res.status(404).json({ message: "Project not found" });
    
    res.json(project);
};