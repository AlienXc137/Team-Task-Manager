import express from "express";
import { createProject, getProjects, updateProject } from "../controllers/projectController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/role.js";

const router = express.Router();

router.post("/", auth, authorize(["admin"]), createProject);
router.get("/", auth, getProjects);
router.put("/:id", auth, authorize(["admin"]), updateProject);

export default router;