import { MainMenuView } from "../views/mainMenuView";
import { AuthController } from "./authController";
import { DashboardController } from "./dashboardController";
import { UserSession } from "../userSession";

export class AppController {
    private mainMenu = new MainMenuView();
    private authController = new AuthController();
    private dashboardController = new DashboardController();

    async run(): Promise<void> {
        while (true) {
            const choice = await this.mainMenu.display();

            switch (choice) {
                case "1":
                    await this.authController.login();
                    break;
                case "2":
                    await this.authController.signup();
                    break;
                case "0":
                    console.log("Exiting application...");
                    process.exit(0);
                default:
                    console.log("Invalid option.");
            }

            const user = UserSession.getUser();
            if (user) {
                await this.dashboardController.route(user);
                UserSession.clear();
            }
        }
    }
}
