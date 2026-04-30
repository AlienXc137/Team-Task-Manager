import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    const project = await Project.create({
        ...req.body,
        createdBy: req.user.id
    });
    res.json(project);
};

export const getProjects = async (req, res) => {
    const projects = await Project.find().populate("members");
    res.json(projects);
};