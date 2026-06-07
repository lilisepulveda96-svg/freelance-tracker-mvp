import express from "express";
import "./config/supabase";

const app = express();

app.use(express.json());
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
