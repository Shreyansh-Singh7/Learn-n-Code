// client/controllers/userController.ts
import readline from "readline-sync";
import { IUser } from "../types/models";
import { formatDateTimeNow } from "../utils/dateUtils";
import { showHeadlinesMenu } from "./userHeadlinesController";
import { showSavedArticlesMenu } from "./userSavedArticlesController";
import { showSearchMenu } from "./userSearchController";
import { showNotificationsMenu } from "./userNotificationsController";

export async function showUserMenu(user: IUser) {
  while (true) {
    console.clear();
    const { date, time } = formatDateTimeNow();
    console.log(`Welcome to the News Application, ${user.username}! Date: ${date} \nTime: ${time}`);
    console.log(`Please choose the options below:`);
    console.log(`1. Headlines`);
    console.log(`2. Saved Articles`);
    console.log(`3. Search`);
    console.log(`4. Notifications`);
    console.log(`5. Logout`);

    const choice = readline.question("Enter choice: ");
    switch (choice) {
      case "1":
        await showHeadlinesMenu(user);
        break;
      case "2":
        await showSavedArticlesMenu(user);
        break;
      case "3":
        await showSearchMenu(user);
        break;
      case "4":
        await showNotificationsMenu(user);
        console.log("🔧 Feature coming soon.");
        readline.question("Press Enter to continue...");
        break;
      case "5":
        return;
      default:
        console.log("❌ Invalid choice.");
        readline.question("Press Enter to continue...");
    }
  }
}
