// client/controllers/adminController.ts
import readline from "readline-sync";
import {
  fetchServerStatuses,
  fetchServerDetails,
  updateServerKey,
  addNewsCategory,
} from "../services/adminService";
import { IUser } from "../types/models";

export async function showAdminMenu(user: IUser) {
  while (true) {
    console.clear();
    console.log(`Welcome Admin ${user.username}`);
    console.log("1. View External Servers Status");
    console.log("2. View External Server Details");
    console.log("3. Update/Edit External Server API Key");
    console.log("4. Add News Category");
    console.log("5. Logout");

    const choice = readline.question("Enter choice: ");

    switch (choice) {
      case "1": {
        const statuses = await fetchServerStatuses();
        console.log("\n--- External Servers Status ---");
        statuses.forEach((s: any, i: number) =>
          console.log(`${i + 1}. ${s.name} - ${s.status} - Last Accessed: ${s.lastAccessed}`)
        );
        break;
      }
      case "2": {
        const servers = await fetchServerDetails();
        console.log("\n--- External Servers Details ---");
        servers.forEach((s: any, i: number) =>
          console.log(`${i + 1}. ${s.name} - API Key: ${s.apiKey}`)
        );
        break;
      }
      case "3": {
        const id = readline.questionInt("Enter server ID to update: ");
        const apiKey = readline.question("Enter new API key: ");
        const updated = await updateServerKey(id, apiKey);
        console.log(updated ? "✅ API key updated." : "❌ Failed to update.");
        break;
      }
      case "4": {
        const category = readline.question("Enter new category name: ");
        const added = await addNewsCategory(category);
        console.log(added ? "✅ Category added." : "❌ Could not add category.");
        break;
      }
      case "5":
        return;
      default:
        console.log("❌ Invalid choice. Try again.");
    }
    readline.question("\nPress Enter to continue...");
  }
}
