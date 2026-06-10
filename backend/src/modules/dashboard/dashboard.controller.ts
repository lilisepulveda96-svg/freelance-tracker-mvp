import type { Request, Response } from "express";
import { supabaseAdmin } from "../../config/supabase";

interface TimeLogWithProject {
  duration_seconds: number | null;
  projects: {
    hourly_rate: number | null;
    name: string;
  } | null;
}

interface ProjectStatus {
  status: string;
}

interface HoursByProject {
  name: string;
  hours: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const getDashboardMetrics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.id;

  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  ).toISOString();

  const [timeLogsResult, customersResult, projectsResult] = await Promise.all([
    supabaseAdmin
      .from("time_logs")
      .select("duration_seconds, projects(name, hourly_rate)")
      .eq("user_id", userId)
      .gte("start_time", startOfMonth)
      .lt("start_time", startOfNextMonth),

    supabaseAdmin
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),

    supabaseAdmin.from("projects").select("status").eq("user_id", userId),
  ]);

  if (timeLogsResult.error) {
    res.status(500).json({ error: timeLogsResult.error.message });
    return;
  }
  if (customersResult.error) {
    res.status(500).json({ error: customersResult.error.message });
    return;
  }
  if (projectsResult.error) {
    res.status(500).json({ error: projectsResult.error.message });
    return;
  }

  const timeLogs: TimeLogWithProject[] =
    timeLogsResult.data as unknown as TimeLogWithProject[];

  const projects: ProjectStatus[] = projectsResult.data ?? [];

  // Calculate total hours for the current month
  const totalSeconds = timeLogs.reduce(
    (acc, log) => acc + (log.duration_seconds ?? 0),
    0,
  );

  const totalHours = round2(totalSeconds / 3600);

  // Calculate projected income for the current month
  const projectedRevenue = round2(
    timeLogs.reduce((acc, log) => {
      const hours = (log.duration_seconds ?? 0) / 3600;
      const rate = log.projects?.hourly_rate ?? 0;
      return acc + hours * rate;
    }, 0),
  );

  // Hours per project for the bar chart
  const hoursByProjectMap: Record<string, { name: string; seconds: number }> =
    {};
  for (const log of timeLogs) {
    const name = log.projects?.name ?? "Unknown";
    if (!hoursByProjectMap[name]) {
      hoursByProjectMap[name] = { name, seconds: 0 };
    }
    hoursByProjectMap[name].seconds += log.duration_seconds ?? 0;
  }

  const hoursByProject: HoursByProject[] = Object.values(hoursByProjectMap)
    .map((p) => ({
      name: p.name,
      hours: round2(p.seconds / 3600),
    }))
    .sort((a, b) => b.hours - a.hours);

  // Completed projects percentage for gauge
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const completedPercentage =
    totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

  res.json({
    totalHours,
    projectedRevenue,
    totalCustomers: customersResult.count ?? 0,
    hoursByProject,
    completedPercentage,
    totalProjects,
    completedProjects,
  });
};
