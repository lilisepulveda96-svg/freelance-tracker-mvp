import "./config/env";

import app from "./app";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
