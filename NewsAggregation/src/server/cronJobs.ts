// src/server/cronJobs.ts
import cron from "node-cron";
import { fetchNewsJob } from "../scripts/fetch-news.ts";
import { getDb } from "../database/db.ts";
//import { checkAndSendNotificationsForUser } from "./services/notificationService.ts";

export function startCronJobs() {
  console.log("[CRON] Scheduling news fetch every minute for testing");
  // for every 1 minute fetch (test), uncomment below line
  cron.schedule('*/1 * * * *', async () => {
  //cron.schedule("0 */1 * * *", async () => {
    console.log(`[CRON] Running fetch job at ${new Date().toLocaleString()}`);
    try {
      await fetchNewsJob();
      console.log("[CRON] ✅ News fetch completed");
    } catch (err) {
      console.error("[CRON] ❌ Failed to fetch news:", err);
    }
  });

  // cron.schedule('0 9 * * *', async () => {
  //   const db = await getDb();
  //   const users = await db.all(`SELECT id, email FROM users`);
  //   for (const user of users) {
  //     await checkAndSendNotificationsForUser(user.id, user.email);
  //   }
  // });
}
