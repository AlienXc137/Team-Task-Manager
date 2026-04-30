import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    const { title, description, status, assignedTo, projectId } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        assignedTo,
        projectId
    });

    res.json(task);
};

export const getTasks = async (req, res) => {
    let tasks;

    if (req.user.role === "admin") {
        tasks = await Task.find().populate("assignedTo");
    } else {
        tasks = await Task.find({ assignedTo: req.user.id });
    }

    res.json(tasks);
};

export const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Not found" });

    // Member restrictions
    if (req.user.role === "member") {
        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        // Only allow status update
        task.status = req.body.status || task.status;

    } else {
        // Admin can update everything
        Object.assign(task, req.body);
    }

    await task.save();
    res.json(task);
};

export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};