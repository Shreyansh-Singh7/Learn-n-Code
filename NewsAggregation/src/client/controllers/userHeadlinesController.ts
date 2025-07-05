import readline from "readline-sync";
import { IUser } from "../types/models";
import {
  fetchHeadlinesByCategory,
  fetchHeadlinesByDateRange,
  saveArticle,
} from "../services/userService";
import User from "../../server/models/user";

export async function showHeadlinesMenu(user: IUser) {
  while (true) {
    console.clear();
    console.log("HEADLINES");
    console.log("1. Today");
    console.log("2. Date range");
    console.log("3. Logout");

    const choice = readline.question("Choose option: ");
    if (choice === "1") {
      const today = new Date().toISOString().split("T")[0];
      await showCategoryMenu(user, today, today);
    } else if (choice === "2") {
      const from = readline.question("Enter start date (YYYY-MM-DD): ");
      const to = readline.question("Enter end date (YYYY-MM-DD): ");
      await showCategoryMenu(user, from, to);
    } else if (choice === "3") {
      return;
    } else {
      console.log("❌ Invalid choice.");
    }
    readline.question("Press Enter to continue...");
  }
}

async function showCategoryMenu(user: IUser, from: string, to: string) {
  while (true) {
    console.clear();
    console.log("HEADLINES CATEGORIES");
    console.log("1. All");
    console.log("2. Business");
    console.log("3. Entertainment");
    console.log("4. Sports");
    console.log("5. Technology");
    console.log("6. Back");
    console.log("7. Logout");

    const choice = readline.question("Select category: ");
    const categories = ["all", "business", "entertainment", "sports", "technology"];

    if (choice === "6") return;
    if (choice === "7") process.exit(0);

    const cat = categories[parseInt(choice) - 1];
    if (!cat) {
      console.log("❌ Invalid category");
      continue;
    }

    const articles = await fetchHeadlinesByDateRange(cat === "all" ? "all" : cat, from, to);

    if (!articles.length) {
      console.log("⚠️ No articles found.");
    } else {
      console.log(`\n📰 Articles (${cat.toUpperCase()}):\n`);
      articles.forEach((a: any, i: number) => {
        console.log(`${i + 1}. ${a.title}`);
        console.log(`   📄 Article ID: ${a.article_id}`);
        console.log(`   🏷️ Category: ${a.category}`);
        console.log(`   📰 Source: ${a.source}`);
        console.log(`   🔗 URL: ${a.url}\n`);
      });
    }

    const save = readline.question("Want to save an article? (y/n): ");
    if (save.toLowerCase() === "y") {
      const articleId = readline.question("Enter Article ID to save: ");
      const success = await saveArticle(user.id, articleId);
      console.log(success ? "✅ Article saved!" : "❌ Failed to save.");
    }

    readline.question("\nPress Enter to go back...");
  }
}
