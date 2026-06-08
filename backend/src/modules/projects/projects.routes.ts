import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createProjectSchema, updateProjectSchema } from "./projects.schema";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "./projects.controller";

export const projectsRouter = Router();

projectsRouter.use(authMiddleware);

projectsRouter.get("/", getProjects);
projectsRouter.get("/:id", getProject);
projectsRouter.post("/", validate(createProjectSchema), createProject);
projectsRouter.put("/:id", validate(updateProjectSchema), updateProject);
projectsRouter.delete("/:id", deleteProject);
