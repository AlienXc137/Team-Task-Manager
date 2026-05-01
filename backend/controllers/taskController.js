import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    const { title, description, status, priority, projectId } = req.body;
    let { assignedTo } = req.body;

    //If the user is a member, force the task to be assigned to them alone.
    if (req.user.role === "member") {
        assignedTo = [req.user.id];
    }

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        assignedTo,
        projectId,
        createdBy: req.user.id
    });

    res.json(task);
};
export const getTasks = async (req, res) => {
    let tasks;
    const query = req.user.role === "admin" ? {} : { assignedTo: req.user.id };

    tasks = await Task.find(query)
        .populate("assignedTo", "name role")
        .populate("createdBy", "name")
        .populate("comments.user", "name"); // 🔴 Populate comment authors

    res.json(tasks);
};

export const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Not found" });

    if (req.user.role === "member") {
        if (!task.assignedTo.includes(req.user.id)) return res.status(403).json({ message: "Not allowed" });
        task.status = req.body.status || task.status;
        // Allow members to update priority/description if desired, or restrict it.
    } else {
        Object.assign(task, req.body);
    }
    await task.save();
    res.json(task);
};

export const addComment = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({
        user: req.user.id,
        text: req.body.text
    });

    await task.save();
    res.json(task);
};

export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
};