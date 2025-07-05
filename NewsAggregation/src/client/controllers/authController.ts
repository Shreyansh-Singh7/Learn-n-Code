// client/controllers/authController.ts
import readline from "readline-sync";
import { loginUser, signupUser } from "../services/authService";
import { showAdminMenu } from "./adminController";
import { showUserMenu } from "./userController";
import { validateEmail, validatePassword } from "../utils/inputValidator";

export async function showLoginMenu() {
  while (true) {
    console.clear();
    console.log("=== Welcome to the News Aggregator App ===");
    console.log("1. Login");
    console.log("2. Sign up");
    console.log("3. Exit");
    const choice = readline.question("Select option: ");

    if (choice === "1") {
      const email = readline.questionEMail("Enter email: ");
      const password = readline.question("Enter password: ", { hideEchoBack: true });
      const user = await loginUser(email, password);

      if (user) {
        user.role === "admin" ? await showAdminMenu(user) : await showUserMenu(user);
      } else {
        console.log("❌ Login failed. Press Enter to continue...");
        readline.question();
      }

    } else if (choice === "2") {
      const username = readline.question("Choose username: ");
      const email = readline.questionEMail("Enter email: ");
      const password = readline.question("Choose password: ", { hideEchoBack: true });

      if (!validateEmail(email) || !validatePassword(password)) {
        console.log("❌ Invalid email or password pattern. Press Enter...");
        readline.question();
        continue;
      }

      const success = await signupUser(username, email, password);
      success
        ? console.log("✅ Signup successful. Please login.")
        : console.log("❌ Signup failed. Try again.");
      readline.question("Press Enter to continue...");

    } else if (choice === "3") {
      console.log("Goodbye!");
      process.exit(0);
    } else {
      console.log("❌ Invalid choice. Try again.");
    }
  }
}
