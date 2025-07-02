import readlineSync from "readline-sync";
import axios from "axios";

export async function adminMenu(token: string) {
  while (true) {
    console.log("\n🛠️ Admin Menu");
    console.log("1. View external servers");
    console.log("2. Edit external server details");
    console.log("3. Add new news category");
    console.log("4. Logout");

    const choice = readlineSync.question("Choose option: ");

    if (choice === "1") {
      await viewExternalServers(token);
    } else if (choice === "2") {
      await editExternalServer(token);
    } else if (choice === "3") {
      await addNewsCategory(token);
    } else if (choice === "4") {
      console.log("👋 Logged out.");
      break;
    } else {
      console.log("Invalid choice.");
    }
  }
}

async function viewExternalServers(token: string) {
  try {
    const res = await axios.get("http://localhost:3000/api/servers", {
      headers: { Authorization: `Bearer ${token}` },
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
  const id = readlineSync.question("Enter the ID of the server to update: ");
  const name = readlineSync.question("Enter new name (leave blank to skip): ");
  const api_url = readlineSync.question("Enter new API URL (leave blank to skip): ");
  const api_key = readlineSync.question("Enter new API Key (leave blank to skip): ");
  const country = readlineSync.question("Enter country (leave blank to skip): ");
  const category = readlineSync.question("Enter category (leave blank to skip): ");
  const is_active_input = readlineSync.question("Set active? (y/n/blank to skip): ");

  const payload: Record<string, any> = {};
  if (name) payload.name = name;
  if (api_url) payload.api_url = api_url;
  if (api_key) payload.api_key = api_key;
  if (country) payload.country = country;
  if (category) payload.category = category;
  if (is_active_input.toLowerCase() === "y") payload.is_active = 1;
  if (is_active_input.toLowerCase() === "n") payload.is_active = 0;

  if (Object.keys(payload).length === 0) {
    console.log("⚠️  No fields to update.");
    return;
  }

  try {
    await axios.put(`http://localhost:3000/api/servers/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Server "${id}" updated successfully.`);
  } catch (err: any) {
    console.error("❌ Failed to update server:", err?.response?.data?.error || err.message);
  }
}

async function addNewsCategory(token: string) {
  const name = readlineSync.question("Enter category name: ");

  try {
    await axios.post(
      "http://localhost:3000/api/admin/categories",
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Category "${name}" added successfully.`);
  } catch (err: any) {
    console.error("❌ Failed to add category:", err?.response?.data?.error || err.message);
  }
}
