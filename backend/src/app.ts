import express from "express";
import "./config/supabase";
import cors from "cors";
import { customersRouter } from "./modules/customers/customers.routes";
import { projectsRouter } from "./modules/projects/projects.routes";
import { timeLogsRouter } from "./modules/time-logs/time-logs.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    exposedHeaders: ["Content-Range"],
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/customers", customersRouter);
app.use("/projects", projectsRouter);
app.use("/time-logs", timeLogsRouter);

export default app;
