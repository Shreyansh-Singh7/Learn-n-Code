import readlineSync from "readline-sync";
import axios from "axios";
import util from "util";
import { useNotificationsMenu } from "./userNotificationsMenu.ts";

export async function userMenu(token: string) {
  while (true) {
    console.log("1. View headlines (today)");
    console.log("2. View saved articles");
    console.log("3. Save an article");
    console.log("4. Unsave an article");
    console.log("5. Filter articles by category/date");
    console.log("6. Notifications");
    console.log("7. Logout");

    const choice = readlineSync.question("Choose option: ");

    if (choice === "1") {
      console.log("🟡 Calling viewTodaysHeadlines...");
      await viewTodaysHeadlines(token);
    } else if (choice === "2") {
      await viewSavedArticles(token);
    } else if (choice === "3") {
      await saveArticleById(token);
    } else if (choice === "4") {
      await unsaveArticleById(token);
    } else if (choice === "5") {
      await filterArticles(token);
    } else if (choice === "6") {
      await useNotificationsMenu(token);
    } else if (choice === "7") {
      console.log("👋 Logged out.");
      break;
    }
  }
}

export async function viewTodaysHeadlines(token: string) {
  try {
    console.log("🔍 Fetching today's headlines...");

    const { data } = await axios.get("http://localhost:3000/news/today", {
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "close",
      },
    });

    if (!data || data.length === 0) {
      console.log("❌ No articles found.");
      return true;
    }

    data.forEach((article: any, index: number) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Published: ${article.published_at}`);
      console.log(`   URL: ${article.url}`);
    });
  } catch (err: any) {
    console.error("❌ Error fetching articles:", err.message);
  }
}

export async function viewSavedArticles(token: string) {
  try {
    const { data } = await axios.get("http://localhost:3000/news/saved", {
      headers: { Authorization: `Bearer ${token}`, Connection: "close" },
    });

    if (!data || data.length === 0) {
      console.log("📭 No saved articles.");
      return;
    }

    console.log("\n🔖 Saved Articles:");
    data.forEach((article: any, index: number) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Published: ${article.published_at}`);
      console.log(`   URL: ${article.url}`);
    });
  } catch (err: any) {
    console.error("❌ Error fetching saved articles:", err.message);
  }
}

export async function saveArticleById(token: string) {
  const articleId = readlineSync.question("Enter article URL to save: ");

  try {
    await axios.post(
      `http://localhost:3000/news/save`,
      { articleId },
      {
        headers: { Authorization: `Bearer ${token}`, Connection: "close" },
      }
    );

    console.log("✅ Article saved.");
  } catch (err: any) {
    console.error("❌ Error saving article:", err.message);
  }
}

export async function unsaveArticleById(token: string) {
  const articleId = readlineSync.question("Enter article URL to unsave: ");
  const encodedId = encodeURIComponent(articleId);

  try {
    await axios.delete(`http://localhost:3000/news/unsave/${encodedId}`, {
      headers: { Authorization: `Bearer ${token}`, Connection: "close" },
    });

    console.log("✅ Article unsaved.");
  } catch (err: any) {
    console.error("❌ Error unsaving article:", err.message);
  }
}

export async function filterArticles(token: string) {
  const category = readlineSync.question(
    "Enter category (or press Enter to skip): "
  );
  const fromDate = readlineSync.question("From date (yyyy-mm-dd, optional): ");
  const toDate = readlineSync.question("To date (yyyy-mm-dd, optional): ");

  const queryParams = new URLSearchParams();

  if (category) queryParams.append("category", category);
  if (fromDate) queryParams.append("from", fromDate);
  if (toDate) queryParams.append("to", toDate);

  const url = `http://localhost:3000/news/filter?${queryParams.toString()}`;

  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "close",
      },
    });

    if (!data || data.length === 0) {
      console.log("❌ No articles found for given filters.");
      return;
    }

    data.forEach((article: any, index: number) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Published: ${article.published_at}`);
      console.log(`   URL: ${article.url}`);
    });
  } catch (err: any) {
    console.error("❌ Error filtering article:", err.message);
  }
}
