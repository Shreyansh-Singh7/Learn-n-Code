import { AuthView } from './views/authView';
import { ClientAuthService } from './services/clientAuthService';
import { UserSession } from './userSession';

async function main(): Promise<void> {
    const clientService = new ClientAuthService();
    const consoleView = new AuthView(clientService);

    consoleView.showWelcome();

    while (true) {
        const choice = await consoleView.promptMainMenu();

        switch (choice) {
            case '1':
                await consoleView.handleLogin();
                break;
            case '2':
                await consoleView.handleSignup();
                break;
            case '0':
                console.log("Exiting application...");
                process.exit(0);
            default:
                console.log("Invalid choice. Please try again.");
        }

        const user = UserSession.getUser();
        if (user) {
            await consoleView.routeToRoleDashboard(user);
            UserSession.clear();
        }
    }
}

main();
