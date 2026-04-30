import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = express.Router();

router.post("/", auth, authorize(["admin"]), createProject);
router.get("/", auth, getProjects);

export default router;