import { useState } from "react";
import { useDataProvider, useGetList, Title } from "react-admin";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import { useTimer } from "./hooks/useTimer";

interface Project {
  id: string;
  name: string;
  status: string;
}

interface DescriptionMap {
  [projectId: string]: string;
}

export const TrackerPage = () => {
  const dataProvider = useDataProvider();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [descriptions, setDescriptions] = useState<DescriptionMap>({});
  const [saving, setSaving] = useState<string | null>(null);

  const {
    start,
    pause,
    resume,
    stop,
    reset,
    getDisplay,
    getStatus,
    activeTimers,
  } = useTimer();

  const { data: projects, isLoading } = useGetList<Project>("projects", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
    filter: { status: "active" },
  });

  const handleStart = () => {
    if (!selectedProjectId) return;
    start(selectedProjectId);
    setSelectedProjectId("");
  };

  const handleStop = async (projectId: string) => {
    const { totalSeconds, startTime } = stop(projectId);

    if (totalSeconds < 1) {
      reset(projectId);
      return;
    }

    setSaving(projectId);

    try {
      await dataProvider.create("time-logs", {
        data: {
          project_id: projectId,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(startTime + totalSeconds * 1000).toISOString(),
          description: descriptions[projectId] ?? "",
        },
      });

      reset(projectId);
      setDescriptions((prev) => {
        const updated = { ...prev };
        delete updated[projectId];
        return updated;
      });
    } catch (err) {
      console.error("Error saving time log:", err);
    } finally {
      setSaving(null);
    }
  };

  const getProjectName = (projectId: string): string => {
    return projects?.find((p) => p.id === projectId)?.name ?? projectId;
  };

  const activeIds = new Set(activeTimers.map((t) => t.projectId));
  const availableProjects = projects?.filter((p) => !activeIds.has(p.id)) ?? [];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Title title="Time Tracker" />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Start a new timer
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                displayEmpty
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
              >
                <MenuItem value="" disabled>
                  Select a project
                </MenuItem>
                {availableProjects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            )}
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleStart}
              disabled={!selectedProjectId}
              fullWidth
            >
              Start
            </Button>
          </Box>
        </CardContent>
      </Card>

      {activeTimers.length === 0 ? (
        <Typography color="text.secondary">
          No active timers. Select a project to start tracking.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {activeTimers.map((timer) => {
            const status = getStatus(timer.projectId);
            const display = getDisplay(timer.projectId);
            const isSaving = saving === timer.projectId;

            return (
              <Card key={timer.projectId}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">
                      {getProjectName(timer.projectId)}
                    </Typography>
                    <Chip
                      label={status}
                      color={status === "running" ? "success" : "warning"}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="h3"
                    fontFamily="monospace"
                    sx={{
                      my: 2,
                      textAlign: "center",
                      fontSize: { xs: "2rem", sm: "3rem" },
                    }}
                  >
                    {display.formatted}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <TextField
                    label="Description"
                    placeholder="What are you working on?"
                    size="small"
                    fullWidth
                    value={descriptions[timer.projectId] ?? ""}
                    onChange={(e) =>
                      setDescriptions((prev) => ({
                        ...prev,
                        [timer.projectId]: e.target.value,
                      }))
                    }
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {status === "running" ? (
                      <Button
                        variant="outlined"
                        startIcon={<PauseIcon />}
                        onClick={() => pause(timer.projectId)}
                        fullWidth
                      >
                        Pause
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => resume(timer.projectId)}
                        fullWidth
                      >
                        Resume
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={
                        isSaving ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <StopIcon />
                        )
                      }
                      onClick={() => handleStop(timer.projectId)}
                      disabled={isSaving}
                      fullWidth
                    >
                      {isSaving ? "Saving..." : "Stop & Save"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
