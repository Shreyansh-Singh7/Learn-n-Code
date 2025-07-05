import express from "express";
import cors from "cors";
import { initDb } from "./db.ts";
import dotenv from "dotenv";
import { startCronJobs } from "./cronJobs.ts";
import { authenticateToken } from "./middleware/authMiddleware.ts";

import authRoutes from "./routes/authRoutes.ts";
import newsRoutes from "./routes/newsRoutes.ts";
import adminRoutes from "./routes/adminRoutes.ts";
import notificationRoutes from "./routes/notificationRoutes.ts";
import userNewsRoutes from "./routes/userNewsRoutes.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/news", authenticateToken, newsRoutes);
app.use("/admin", authenticateToken, adminRoutes);
app.use("/notifications", authenticateToken, notificationRoutes);
app.use("/user-news", userNewsRoutes);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    startCronJobs();
  });
});
