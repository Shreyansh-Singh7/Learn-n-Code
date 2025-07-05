// client/controllers/userNotificationsController.ts
import readline from "readline-sync";
import {
  getNotificationConfig,
  getNotifications,
  toggleCategory,
  updateKeywords,
} from "../services/userService";
import { IUser } from "../types/models";

export async function showNotificationsMenu(user: IUser) {
  while (true) {
    console.clear();
    console.log("NOTIFICATIONS MENU");
    console.log("1. View Notifications");
    console.log("2. Configure Notifications");
    console.log("3. Back");
    console.log("4. Logout");

    const choice = readline.question("Select option: ");
    if (choice === "1") {
      await handleViewNotifications(user.id);
    } else if (choice === "2") {
      await handleConfigureNotifications(user.id);
    } else if (choice === "3") return;
    else if (choice === "4") process.exit(0);
    else console.log("❌ Invalid option.");

    readline.question("Press Enter to continue...");
  }
}

async function handleViewNotifications(userId: number) {
  console.clear();
  const notifications = await getNotifications(userId);
  if (!notifications.length) {
    console.log("🔕 No notifications available.");
  } else {
    console.log("🔔 Your Notifications:");
    notifications.forEach((n: any, i: number) => {
      console.log(`${i + 1}. ${n.message}`);
      console.log(`   Article: ${n.article?.title}`);
      console.log(`   URL: ${n.article?.url}\n`);
    });
  }
}

async function handleConfigureNotifications(userId: number) {
  const config = await getNotificationConfig(userId);
  console.clear();
  console.log("NOTIFICATION SETTINGS:");
  config.categories.forEach((c: any, i: number) => {
    console.log(`${i + 1}. ${c.name} - ${c.enabled ? "Enabled" : "Disabled"}`);
  });
  console.log(`${config.categories.length + 1}. Keywords - ${config.keywordsEnabled ? "Enabled" : "Disabled"}`);
  console.log(`${config.categories.length + 2}. Update Keywords`);
  console.log(`${config.categories.length + 3}. Back`);

  const choice = readline.questionInt("Select option: ");
  const max = config.categories.length;

  if (choice >= 1 && choice <= max) {
    const categoryId = config.categories[choice - 1].id;
    await toggleCategory(userId, categoryId);
    console.log("✅ Category updated.");
  } else if (choice === max + 1) {
    await toggleCategory(userId, "keywords");
    console.log("✅ Keywords notifications toggled.");
  } else if (choice === max + 2) {
    const kw = readline.question("Enter keywords (comma-separated): ");
    await updateKeywords(userId, kw);
    console.log("✅ Keywords updated.");
  } else if (choice === max + 3) {
    return;
  } else {
    console.log("❌ Invalid choice.");
  }
}
