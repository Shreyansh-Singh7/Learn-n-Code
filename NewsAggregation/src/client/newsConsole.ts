import readlineSync from "readline-sync";
import { login, signup, getSession } from "./auth/authClient.js";
import { adminMenu } from "./admin/adminMenu.js";
import { userMenu } from "./user/userMenu.js";

console.log("=== Welcome to the News Aggregator App ===");

async function mainMenu() {
  while (true) {
    console.log("\n1. Login\n2. Sign up\n3. Exit");
    const choice = readlineSync.question("Select option: ");

    if (choice === "1") {
      try {
        const result = await login();
        if (result) {
          const { role, token } = getSession();
          if (role === "admin") {
            const switchChoice = readlineSync.question(
              "🔄 You're an admin. Use app as:\n1. Admin\n2. Regular User\nChoose option: "
            );

            if (switchChoice === "1") {
              await adminMenu(token!);
            } else if (switchChoice === "2") {
              await userMenu(token!);
            } else {
              console.log("❌ Invalid choice. Logging out.");
            }
          } else {
            await userMenu(token!);
          }
        }
      } catch (e) {
        console.error("⚠️ Unexpected error:", e);
      }
    } else if (choice === "2") {
      await signup();
    } else if (choice === "3") {
      console.log("👋 Goodbye!");
      break;
    } else {
      console.log("Invalid option.");
    }
  }
}

mainMenu();
