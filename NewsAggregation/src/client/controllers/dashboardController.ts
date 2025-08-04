import { IUser } from "../../utils/types";
import { AdminDashboardController } from "./adminDashboardController";
import { UserDashboardController } from "./userDashboardController";

export class DashboardController {
    private adminDashboardController = new AdminDashboardController();
    private userDashboard = new UserDashboardController();

    async route(user: IUser): Promise<void> {
        switch (user.role_id) {
            case 1:
                await this.adminDashboardController.start();
                break;
            case 2:
                await this.userDashboard.start(user);
                break;
            default:
                console.log("Unknown role. Access denied.");
        }
    }
}
