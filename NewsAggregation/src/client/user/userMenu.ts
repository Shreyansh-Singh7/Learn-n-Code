import readlineSync from "readline-sync";
import axios from "axios";
import util from "util";
import { useNotificationsMenu } from "./userNotificationsMenu.ts";

export async function userMenu(token: string) {
  while (true) {
    console.log("\n1. View headlines (today)");
    console.log("2. View saved articles");
    console.log("3. Save an article");
    console.log("4. Unsave an article");
    console.log("5. Filter articles by category/date");
    console.log("6. Notifications");
    console.log("7. Logout");

    const choice = readlineSync.question("Choose option: ");

    if (choice === "1") {
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

    const { data } = await axios.get("http://localhost:3000/api/news/today", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data || data.length === 0) {
      console.log("🛑 No news found for today.");
      return;
    }

    data.forEach((article: any, index: number) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Published: ${article.published_at}`);
      console.log(`   URL: ${article.url}`);
    });
  } catch (err: any) {
    console.error("❌ Error fetching headlines:", err?.response?.data?.error || err.message);
  }
}

async function viewSavedArticles(token: string) {
  try {
    const { data } = await axios.get("http://localhost:3000/api/user/saved", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (data.length === 0) {
      console.log("📭 No saved articles.");
      return;
    }

    console.log("\n💾 Saved Articles:");
    data.forEach((article: any, i: number) => {
      console.log(`\n${i + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Published: ${article.published_at}`);
      console.log(`   URL: ${article.url}`);
    });
  } catch (err: any) {
    console.error("❌ Failed to fetch saved articles:", err?.response?.data?.error || err.message);
  }
}

async function saveArticleById(token: string) {
  const articleId = readlineSync.question("Enter article ID to save: ");

  try {
    await axios.post(
      "http://localhost:3000/api/user/save",
      { articleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Article saved.");
  } catch (err: any) {
    console.error("❌ Failed to save article:", err?.response?.data?.error || err.message);
  }
}

async function unsaveArticleById(token: string) {
  const articleId = readlineSync.question("Enter article ID to unsave: ");

  try {
    await axios.delete(`http://localhost:3000/api/user/unsave/${articleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Article removed from saved list.");
  } catch (err: any) {
    console.error("❌ Failed to unsave article:", err?.response?.data?.error || err.message);
  }
}

async function filterArticles(token: string) {
  const category = readlineSync.question("Filter by category (leave blank to skip): ");
  const from = readlineSync.question("From date (YYYY-MM-DD, blank to skip): ");
  const to = readlineSync.question("To date (YYYY-MM-DD, blank to skip): ");

  const params: Record<string, string> = {};
  if (category) params.category = category;
  if (from) params.from = from;
  if (to) params.to = to;

  try {
    const { data } = await axios.get("http://localhost:3000/api/news/filter", {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    if (!data || data.length === 0) {
      console.log("🛑 No news found matching filters.");
      return;
    }

    data.forEach((article: any, i: number) => {
      console.log(`\n${i + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Published: ${article.published_at}`);
      console.log(`   URL: ${article.url}`);
    });
  } catch (err: any) {
    console.error("❌ Failed to filter articles:", err?.response?.data?.error || err.message);
  }
}
