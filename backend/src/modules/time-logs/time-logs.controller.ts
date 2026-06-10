import type { Request, Response } from "express";
import { supabaseAdmin } from "../../config/supabase";
import type { CreateTimeLogInput } from "./time-logs.schema";

export const createTimeLog = async (
  req: Request<object, object, CreateTimeLogInput>,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;

  const { data, error } = await supabaseAdmin
    .from("time_logs")
    .insert({
      ...req.body,
      user_id: userId,
    })
    .select(
      "id, project_id, start_time, end_time, duration_seconds, description, created_at",
    )
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

export const getTimeLogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const start = Number(req.query._start ?? 0);
  const end = Number(req.query._end ?? 10);

  const { data, error, count } = await supabaseAdmin
    .from("time_logs")
    .select(
      "id, project_id, start_time, end_time, duration_seconds, description, created_at",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .order("start_time", { ascending: false })
    .range(start, end - 1);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.setHeader("Content-Range", `time-logs ${start}-${end - 1}/${count}`);
  res.json(data);
};
