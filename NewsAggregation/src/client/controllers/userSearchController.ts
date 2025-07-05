// client/controllers/userSearchController.ts
import readline from "readline-sync";
import { IUser } from "../types/models";
import { saveArticle, searchArticles } from "../services/userService";

export async function showSearchMenu(user: IUser) {
  while (true) {
    console.clear();
    console.log("SEARCH ARTICLES");

    const keyword = readline.question("Enter search keyword: ");
    const useDate = readline.question("Do you want to filter by date? (y/n): ");

    let from = "", to = "";
    if (useDate.toLowerCase() === "y") {
      from = readline.question("Start Date (YYYY-MM-DD): ");
      to = readline.question("End Date (YYYY-MM-DD): ");
    }

    const sort = readline.question("Sort by (likes/dislikes/none): ").toLowerCase();

    const results = await searchArticles(keyword, from, to, sort);
    if (!results.length) {
      console.log("❌ No results found.");
    } else {
      console.log(`\nResults for “${keyword}”:\n`);
      results.forEach((a: any, i: number) => {
        console.log(`${i + 1}. ${a.title}`);
        console.log(`   Article ID: ${a.article_id}`);
        console.log(`   Source: ${a.source}`);
        console.log(`   Likes: ${a.likes}, Dislikes: ${a.dislikes}`);
        console.log(`   URL: ${a.url}`);
        console.log(`   Category: ${a.category}\n`);
      });

      const save = readline.question("Want to save any article? (y/n): ");
      if (save.toLowerCase() === "y") {
        const articleId = readline.question("Enter Article ID to save: ");
        const saved = await saveArticle(user.id, articleId);
        console.log(saved ? "✅ Article saved!" : "❌ Failed to save.");
      }
    }

    console.log("\n1. Back");
    console.log("2. Logout");
    const next = readline.question("Select option: ");
    if (next === "1") return;
    if (next === "2") process.exit(0);
  }
}
