import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createTimeLogSchema } from "./time-logs.schema";
import { createTimeLog, getTimeLogs } from "./time-logs.controller";

export const timeLogsRouter = Router();

timeLogsRouter.use(authMiddleware);

timeLogsRouter.get("/", getTimeLogs);
timeLogsRouter.post("/", validate(createTimeLogSchema), createTimeLog);
