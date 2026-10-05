import "dotenv/config";
import express from "express";
import repositoryRoutes from "./routes/repository.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

app.use((req, res, next) => {
  next();
});

app.use("/api/repositories", repositoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "API endpoint not found",
    },
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: err.code || "INTERNAL_ERROR",
      message:
        err.code === "AI_TOKEN_LIMIT"
          ? "Ripple AI reached its token limit for this request. Please try a shorter request or wait a few seconds before trying again."
          : err.message || "Internal server error",
    },
  });
});

export default app;
