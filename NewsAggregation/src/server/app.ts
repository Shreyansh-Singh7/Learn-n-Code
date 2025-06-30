import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import dotenv from "dotenv";
import { startCronJobs } from "./cronJobs.js";
import { authenticateToken } from "./middleware/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userNewsRoutes from "./routes/userNewsRoutes.js";

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
    console.log(`Server running at http://localhost:${PORT}`);
    startCronJobs();
  });
});
