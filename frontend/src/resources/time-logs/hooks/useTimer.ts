import { useState, useEffect, useCallback, useMemo } from "react";

type TimerStatus = "running" | "paused" | "stopped";

interface TimerState {
  projectId: string;
  status: TimerStatus;
  startTime: number;
  accumulatedMs: number;
  lastResumeTime: number | null;
}

interface TimerDisplay {
  formatted: string;
  totalSeconds: number;
}

const STORAGE_KEY = "freelance_tracker_timers";

const loadTimers = (): Record<string, TimerState> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveTimers = (timers: Record<string, TimerState>): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
};

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

const getElapsedMs = (timer: TimerState): number => {
  if (timer.status === "running" && timer.lastResumeTime !== null) {
    return timer.accumulatedMs + (Date.now() - timer.lastResumeTime);
  }
  return timer.accumulatedMs;
};

export const useTimer = () => {
  const [timers, setTimers] = useState<Record<string, TimerState>>(loadTimers);

  const [, forceRender] = useState(0);

  const hasRunning = useMemo(
    () => Object.values(timers).some((t) => t.status === "running"),
    [timers],
  );

  useEffect(() => {
    if (!hasRunning) return;

    const interval = setInterval(() => {
      forceRender((v) => v + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasRunning]);

  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  const start = useCallback((projectId: string) => {
    setTimers((prev) => ({
      ...prev,
      [projectId]: {
        projectId,
        status: "running",
        startTime: Date.now(),
        accumulatedMs: 0,
        lastResumeTime: Date.now(),
      },
    }));
  }, []);

  const pause = useCallback((projectId: string) => {
    setTimers((prev) => {
      const timer = prev[projectId];
      if (!timer || timer.status !== "running") return prev;
      return {
        ...prev,
        [projectId]: {
          ...timer,
          status: "paused",
          accumulatedMs: getElapsedMs(timer),
          lastResumeTime: null,
        },
      };
    });
  }, []);

  const resume = useCallback((projectId: string) => {
    setTimers((prev) => {
      const timer = prev[projectId];
      if (!timer || timer.status !== "paused") return prev;
      return {
        ...prev,
        [projectId]: {
          ...timer,
          status: "running",
          lastResumeTime: Date.now(),
        },
      };
    });
  }, []);

  const stop = useCallback(
    (projectId: string) => {
      const timer = timers[projectId];
      if (!timer) return { totalSeconds: 0, startTime: Date.now() };

      const elapsedMs = getElapsedMs(timer);
      const totalSeconds = Math.floor(elapsedMs / 1000);

      setTimers((prev) => ({
        ...prev,
        [projectId]: {
          ...timer,
          status: "stopped",
          accumulatedMs: elapsedMs,
          lastResumeTime: null,
        },
      }));

      return { totalSeconds, startTime: timer.startTime };
    },
    [timers],
  );

  const reset = useCallback((projectId: string) => {
    setTimers((prev) => {
      const updated = { ...prev };
      delete updated[projectId];
      return updated;
    });
  }, []);

  const getDisplay = useCallback(
    (projectId: string): TimerDisplay => {
      const timer = timers[projectId];
      if (!timer) return { formatted: "00:00:00", totalSeconds: 0 };
      const totalSeconds = Math.floor(getElapsedMs(timer) / 1000);
      return { formatted: formatTime(totalSeconds), totalSeconds };
    },
    [timers],
  );

  const getStatus = useCallback(
    (projectId: string): TimerStatus | "idle" => {
      return timers[projectId]?.status ?? "idle";
    },
    [timers],
  );

  const getStartTime = useCallback(
    (projectId: string): number | null => {
      return timers[projectId]?.startTime ?? null;
    },
    [timers],
  );

  return {
    start,
    pause,
    resume,
    stop,
    reset,
    getDisplay,
    getStatus,
    getStartTime,
    activeTimers: Object.values(timers),
  };
};
