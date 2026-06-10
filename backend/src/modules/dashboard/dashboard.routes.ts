import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getDashboardMetrics } from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);
dashboardRouter.get("/", getDashboardMetrics);
