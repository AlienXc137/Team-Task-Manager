import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on 5000");
        });

    } catch (err) {
        console.error("Startup error:", err);
    }
};

startServer();