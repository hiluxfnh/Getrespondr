import cors from "cors";
import cron from "node-cron";
import express from "express";

import { config } from "./config.js";
import { initFirebase } from "./firebase.js";
import agentRoutes from "./routes/agent.js";
import healthRoutes from "./routes/health.js";
import { runClimateScan } from "./services/incidentProcessor.js";
import { updateAgentConfig } from "./services/agentState.js";

initFirebase();
await updateAgentConfig({ isScanning: false });

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/agent", agentRoutes);

let cronJob = null;

function startScheduler() {
  if (cronJob) {
    cronJob.stop();
  }

  const minutes = config.scanIntervalMinutes;
  const cronExpression = `*/${minutes} * * * *`;
  cronJob = cron.schedule(cronExpression, () => {
    console.log(`[scheduler] Running climate scan (every ${minutes} min)`);
    runClimateScan().then((result) => {
      console.log(`[scheduler] ${result.message}`);
    });
  });

  console.log(`[scheduler] Climate agent scheduled every ${minutes} minutes`);
}

startScheduler();

const server = app.listen(config.port, () => {
  console.log(`GetRespondr backend running on http://localhost:${config.port}`);
  setTimeout(() => {
    runClimateScan().then((result) => {
      console.log(`[startup] Initial scan: ${result.message}`);
    });
  }, 2000);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `[server] Port ${config.port} is already in use. Stop the other process or set PORT in backend/.env`
    );
    process.exit(1);
  }
  throw error;
});

export default app;
