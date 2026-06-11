import { useEffect, useState } from "react";
import { axiosClient } from "../../config/axiosClient";

import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Grid,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DashboardMetrics = {
  totalHours: number;
  projectedRevenue: number;
  totalCustomers: number;
  hoursByProject: { name: string; hours: number }[];
  completedPercentage: number;
  totalProjects: number;
  completedProjects: number;
};

export const Dashboard = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosClient.get("/dashboard-metrics");
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <Box sx={{ py: { xs: 2, sm: 3 } }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ flex: "1" }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Hours this month
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {data.totalHours}h
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1" }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Projected revenue
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                ${data.projectedRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1" }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total clients
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {data.totalCustomers}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
        }}
      >
        {/* Bar chart 70% */}
        <Box sx={{ flex: "2" }}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hours per Project
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.hoursByProject}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        {/* Gauge chart 30% */}
        <Box sx={{ flex: "1" }}>
          <Card sx={{ height: 360 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6">Completion</Typography>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={140}
                    thickness={5}
                    sx={{ color: "#e0e0e0", position: "absolute" }}
                  />

                  <CircularProgress
                    variant="determinate"
                    value={data.completedPercentage}
                    size={140}
                    thickness={5}
                    sx={{
                      color: "success.main",
                      "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5">
                    {data.completedPercentage}%
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mt: 2 }}>
                {data.completedProjects} / {data.totalProjects}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
