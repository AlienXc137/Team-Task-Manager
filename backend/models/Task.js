import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { 
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
    dueDate: { type: Date },
    comments: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);