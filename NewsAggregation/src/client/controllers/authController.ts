import { AuthView } from "../views/authView";
import { ClientAuthService } from "../services/clientAuthService";
import { UserSession } from "../userSession";

export class AuthController {
    private authView = new AuthView();
    private authService = new ClientAuthService();

    async login(): Promise<void> {
        try {
            const credentials = await this.authView.getLoginDetails();
            const user = await this.authService.login(credentials);
            UserSession.setUser(user);
            this.authView.showMessage(`Welcome back, ${user.username}`);
        } catch (err: any) {
            this.authView.showMessage("Login failed: " + err.message);
        }
    }

    async signup(): Promise<void> {
        try {
            const userInfo = await this.authView.getSignupDetails();
            const user = await this.authService.signup(userInfo);
            UserSession.setUser(user);
            this.authView.showMessage(`Account created: Welcome ${user.username}`);
        } catch (err: any) {
            this.authView.showMessage("Signup failed: " + err.message);
        }
    }
}
