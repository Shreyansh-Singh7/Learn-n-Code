// client/controllers/userSavedArticlesController.ts
import readline from "readline-sync";
import { IUser } from "../types/models";
import { deleteSavedArticle, fetchSavedArticles } from "../services/userService";

export async function showSavedArticlesMenu(user: IUser) {
  while (true) {
    console.clear();
    console.log(`SAVED ARTICLES`);

    const saved = await fetchSavedArticles(user.id);
    if (!saved.length) {
      console.log("❗ No saved articles.");
    } else {
      saved.forEach((a: any, i: number) => {
        console.log(`${i + 1}. ${a.title}`);
        console.log(`   ID: ${a.article_id}`);
        console.log(`   Source: ${a.source}`);
        console.log(`   URL: ${a.url}`);
        console.log(`   Category: ${a.category}\n`);
      });
    }

    console.log("1. Back");
    console.log("2. Logout");
    console.log("3. Delete Article");

    const choice = readline.question("Choose option: ");
    if (choice === "1") return;
    if (choice === "2") process.exit(0);

    if (choice === "3") {
      const articleId = readline.question("Enter Article ID to delete: ");
      const deleted = await deleteSavedArticle(user.id, articleId);
      console.log(deleted ? "✅ Deleted successfully." : "❌ Deletion failed.");
      readline.question("Press Enter to continue...");
    }
  }
}
