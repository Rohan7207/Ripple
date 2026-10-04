import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

// Health endpoint (API_CONTRACT.md: GET /api/health)
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

// 404 handler for undefined API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "API endpoint not found" },
  });
});

// Global error handler (API_CONTRACT.md conventions)
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: err.message || "Internal server error",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Ripple backend listening on port ${PORT}`);
});
