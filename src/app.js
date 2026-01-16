import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import diaryRoutes from "./routes/diary.routes.js";
import healthRoutes from "./routes/healthcheck.routes.js";
import devRoutes from "./routes/dev.routes.js";

import errorHandler from "./middlewares/error.middleware.js";
import requestIdMiddleware from "./middlewares/requestId.middleware.js";

const app = express();

/*  GLOBAL MIDDLEWARES  */

app.use(requestIdMiddleware);

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(",") ||
      "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

/*  ROUTES  */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/analysis", analysisRoutes);
app.use("/api/v1/diary", diaryRoutes);
app.use("/api/v1", healthRoutes);

if (process.env.NODE_ENV === "development") {
  app.use("/api/v1/dev", devRoutes);
}

/*  ERROR HANDLER  */

app.use(errorHandler);

export default app;
