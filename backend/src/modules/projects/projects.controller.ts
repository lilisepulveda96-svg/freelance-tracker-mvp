import type { Request, Response } from "express";
import { supabaseAdmin } from "../../config/supabase";
import type { CreateProjectInput, UpdateProjectInput } from "./projects.schema";

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const start = Number(req.query._start ?? 0);
  const end = Number(req.query._end ?? 10);
  const status = req.query.status as string | undefined;

  let query = supabaseAdmin
    .from("projects")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .range(start, end - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.setHeader("Content-Range", `projects ${start}-${end - 1}/${count}`);
  res.json(data);
};

export const getProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(data);
};

export const createProject = async (
  req: Request<object, object, CreateProjectInput>,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({ ...req.body, user_id: userId })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

export const updateProject = async (
  req: Request<{ id: string }, object, UpdateProjectInput>,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(req.body)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json(data);
};

export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(204).send();
};
