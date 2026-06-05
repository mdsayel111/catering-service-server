const express = require("express");
const cors = require("cors");
const { connectDB } = require("./utils/DB");
const rootRouter = require("./modules/root/router");
const globalErrorHandler = require("./middlewares/global-error-handler");
const config = require("./config");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

// JSON parser
app.use(express.json());

// API routes
app.use("/api", rootRouter);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config?.port, () =>
      console.log(`Example app listening on port ${config?.port}`),
    );

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise, "reason:", reason);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("Uncaught Exception:", err);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

// Global error handler (must be after routes)
app.use(globalErrorHandler);

// backend / index.js;
