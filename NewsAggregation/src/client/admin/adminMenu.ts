// src/client/admin/adminMenu.ts
import readlineSync from "readline-sync";
import axios from "axios";
import { getSession } from "../auth/authClient.js";

export async function adminMenu(token: string) {
  while (true) {
    console.log("\n🛠️ Admin Menu");
    console.log("1. View external server status");
    console.log("2. View external server details");
    console.log("3. Edit external server details");
    console.log("4. Add new news category");
    console.log("5. Logout");

    const choice = readlineSync.question("Choose option: ");

    if (choice === "1") {
      await viewExternalServerStatus(token);
    } else if (choice === "2") {
      await viewExternalServers(token); // 👈 add this
    } else if (choice === "3") {
      await editExternalServer(token);
    } else if (choice === "4") {
      await addNewsCategory(token || "");
    } else if (choice === "5") {
      console.log("👋 Logged out.");
      break;
    } else {
      console.log("🚧 Feature not implemented yet.");
    }
  }
}

async function addNewsCategory(token: string) {
  const name = readlineSync.question("Enter category name: ");

  try {
    const res = await axios.post(
      "http://localhost:3000/admin/categories",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Connection: "close",
        },
      }
    );
    console.log(`✅ Category "${name}" added successfully.`);
  } catch (err: any) {
    const message = err?.response?.data?.error || err.message;
    console.error("❌ Failed to add category:", message);
  }
}

async function viewExternalServerStatus(token: string) {
  try {
    console.log("🔍 Checking external server status...");

    const res = await axios.get(
      "http://localhost:3000/admin/external-server/status",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Connection: "close",
        },
      }
    );

    console.log(`\n🟢 Status: ${res.data.status.toUpperCase()}`);
    if (res.data.responseTimeMs) {
      console.log(`⏱️  Response Time: ${res.data.responseTimeMs} ms`);
    }
    if (res.data.message) {
      console.log(`ℹ️  Message: ${res.data.message}`);
    }
  } catch (err: any) {
    const message = err?.response?.data?.error || err.message;
    console.error("❌ Failed to fetch server status :", message);
  }
}

async function viewExternalServers(token: string) {
  try {
    const res = await axios.get("http://localhost:3000/admin/external-server", {
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "close",
      },
    });

    console.log("\n🌐 External Servers:");
    res.data.forEach((server: any, i: number) => {
      console.log(`\n${i + 1}. ${server.name}`);
      console.log(`   ID: ${server.id}`);
      console.log(`   URL: ${server.api_url}`);
      console.log(`   Country: ${server.country}`);
      console.log(`   Category: ${server.category}`);
      console.log(`   Active: ${server.is_active ? "✅ Yes" : "❌ No"}`);
    });
  } catch (err: any) {
    console.error(
      "❌ Failed to fetch external servers:",
      err?.response?.data?.error || err.message
    );
  }
}

async function editExternalServer(token: string) {
  const id = readlineSync.question(
    "Enter the ID of the server to update (e.g. newsapi): "
  );

  const name = readlineSync.question("Enter new name (leave blank to skip): ");
  const api_url = readlineSync.question(
    "Enter new API URL (leave blank to skip): "
  );
  const api_key = readlineSync.question(
    "Enter new API Key (leave blank to skip): "
  );
  const country = readlineSync.question(
    "Enter country code (leave blank to skip): "
  );
  const category = readlineSync.question(
    "Enter category (leave blank to skip): "
  );

  let is_active_input = readlineSync.question(
    "Set active? (y/n/leave blank to skip): "
  );
  let is_active: number | undefined;
  if (is_active_input.toLowerCase() === "y") is_active = 1;
  if (is_active_input.toLowerCase() === "n") is_active = 0;

  const payload: Record<string, any> = {};
  if (name) payload.name = name;
  if (api_url) payload.api_url = api_url;
  if (api_key) payload.api_key = api_key;
  if (country) payload.country = country;
  if (category) payload.category = category;
  if (is_active !== undefined) payload.is_active = is_active;

  if (Object.keys(payload).length === 0) {
    console.log("⚠️  No fields entered to update.");
    return;
  }

  try {
    await axios.put(
      `http://localhost:3000/admin/external-server/${id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}`, Connection: "close" },
      }
    );
    console.log(`✅ Server "${id}" updated successfully.`);
  } catch (err: any) {
    console.error(
      "❌ Failed to update server:",
      err?.response?.data?.error || err.message
    );
  }
}
