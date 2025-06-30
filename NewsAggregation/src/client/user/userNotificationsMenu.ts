import readlineSync from "readline-sync";
import axios from "axios";

export async function useNotificationsMenu(token: string) {
  while (true) {
    console.log("\n🔔 NOTIFICATIONS");
    console.log("1. View Notifications");
    console.log("2. Configure Notifications");
    console.log("3. Back");
    console.log("4. Logout");

    const choice = readlineSync.question("Choose option: ");

    if (choice === "1") {
      await viewNotifications(token);
    } else if (choice === "2") {
      await configureNotifications(token);
    } else if (choice === "3") {
      break;
    } else if (choice === "4") {
      console.log("👋 Logged out.");
      process.exit(0);
    } else {
      console.log("Invalid option.");
    }
  }
}

async function viewNotifications(token: string) {
  try {
    const res = await axios.get("http://localhost:3000/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.length) {
      console.log("❌ No notifications found.");
      return;
    }

    console.log("\n📬 Your Notifications:");
    res.data.forEach((n: any, idx: number) => {
      console.log(`\n${idx + 1}. ${n.title}`);
      console.log(`   Source: ${n.source}`);
      console.log(`   Published: ${n.published_at}`);
      console.log(`   URL: ${n.url}`);
    });
  } catch (err: any) {
    console.error("❌ Failed to fetch notifications:", err.message);
  }
}

async function configureNotifications(token: string) {
  try {
    const res = await axios.get("http://localhost:3000/notifications/config", {
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "close",
      },
    });

    console.log(res.data);

    let categories = res.data.categories;
    let keywords = res.data.keywords;

    while (true) {
      console.log("\n⚙️  CONFIGURE - NOTIFICATIONS");
      categories.forEach((cat: any, i: number) => {
        console.log(
          `${i + 1}. ${cat.category} - ${cat.enabled ? "Enabled" : "Disabled"}`
        );
      });
      console.log(
        `${categories.length + 1}. Keywords - ${
          keywords.length ? "Enabled" : "Disabled"
        }`
      );
      console.log(`${categories.length + 2}. Back`);
      console.log(`${categories.length + 3}. Logout`);

      const choice = parseInt(readlineSync.question("Choose option: "), 10);

      if (choice >= 1 && choice <= categories.length) {
        const cat = categories[choice - 1];
        const newStatus = !cat.enabled;
        await axios.post(
          "http://localhost:3000/notifications/category",
          { category: cat.name, enabled: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Connection: "close",
            },
          }
        );
        console.log(
          `✅ ${cat.name} notifications ${newStatus ? "enabled" : "disabled"}.`
        );
        cat.enabled = newStatus;
      } else if (choice === categories.length + 1) {
        const newKeywords = readlineSync.question(
          "Enter comma-separated keywords: "
        );
        const keywordArray =
          newKeywords === "" ? [] : newKeywords.split(",").map((k) => k.trim());
        await axios.post(
          "http://localhost:3000/notifications/keywords",
          { keywords: keywordArray },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Connection: "close",
            },
          }
        );
        console.log("✅ Keywords updated.");
      } else if (choice === categories.length + 2) {
        break;
      } else if (choice === categories.length + 3) {
        console.log("👋 Logged out.");
        process.exit(0);
      } else {
        console.log("Invalid option.");
      }
    }
  } catch (err: any) {
    console.error("❌ Failed to load configuration:", err.message);
  }
}
