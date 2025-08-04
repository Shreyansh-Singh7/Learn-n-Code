import readline from 'readline-sync';
import { ClientNotificationService } from '../services/clientNotificationService';

type IUser = {
  userId: number;
  username: string;
  email?: string;
  role?: string;
};

const service = new ClientNotificationService();

export async function configureNotifications(user: IUser) {
  while (true) {
    console.clear();
    console.log("==== CONFIGURE NOTIFICATIONS ====");
    console.log(`Logged in as: ${user.username}`);
    console.log(`Time: ${new Date().toLocaleString()}\n`);

    const settings = await service.getUserSettings(user.userId);

    const keywordSetting = settings.find((s: any) => s.keywords);
    const categorySettings = settings.filter((s: any) => s.category_id !== 0);

    categorySettings.forEach((s: any, i: number) => {
      console.log(`${i + 1}. ${s.category_name} - ${s.enabled ? 'Enabled' : 'Disabled'}`);
    });

    console.log(`${categorySettings.length + 1}. Configure Keywords`);
    console.log(`${categorySettings.length + 2}. Back to Notifications Menu`);

    const choice = readline.questionInt("\nEnter your choice: ");

    if (choice === categorySettings.length + 2) return;

    if (choice === categorySettings.length + 1) {
      await handleKeywordConfig(user, keywordSetting?.keywords || []);
      continue;
    }

    const selected = categorySettings[choice - 1];
    console.log("DEBUG SELECTED:", selected);
    if (!selected || selected.category_id === undefined) {
        console.log("❌ Invalid choice or missing category ID.");
        readline.question("Press enter to continue...");
        continue;
    }

    const newValue = !selected.enabled;
    await service.configureSetting(user.userId, selected.category_id, newValue);
    console.log(`✅ ${selected.category_name} set to ${newValue ? 'Enabled' : 'Disabled'}`);
    readline.question("Press enter to continue...");
  }
}

async function handleKeywordConfig(user: IUser, currentKeywords: string[]) {
  while (true) {
    console.clear();
    console.log("==== KEYWORD SETTINGS ====");
    //console.log(`Current Keywords: ${currentKeywords.join(', ') || 'None'}\n`);
    console.log("1. Add Keyword");
    console.log("2. Remove Keyword");
    console.log("3. Back");

    const input = readline.questionInt("Enter choice: ");

    if (input === 3) return;

    let updatedKeywords = [...currentKeywords];
    if (input === 1) {
      const kw = readline.question("Enter keyword to add: ");
      if (!updatedKeywords.includes(kw)) updatedKeywords.push(kw);
    } else if (input === 2) {
      const rm = readline.question("Enter keyword to remove: ");
      updatedKeywords = updatedKeywords.filter((k) => k !== rm);
    }

    await service.configureSetting(user.userId, 0, true, updatedKeywords);
    console.log("✅ Keywords updated.");
    currentKeywords = updatedKeywords;
    readline.question("Press enter to continue...");
  }
}
