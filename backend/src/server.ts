import "./config/env";

import app from "./app";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(
    `Supabase URL: ${process.env.SUPABASE_URL ? "✓ loaded" : "✗ missing"}`,
  );
  console.log(
    `Supabase Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ loaded" : "✗ missing"}`,
  );
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
