import { ask } from '../../utils/helpers';

export class MainMenuView {
    async display(): Promise<string> {
        console.log("\n=== News Aggregation ===");
        console.log("1. Login");
        console.log("2. Signup");
        console.log("0. Exit");
        return await ask("Choose an option: ");
    }
}
