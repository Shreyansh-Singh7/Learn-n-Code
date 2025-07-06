import { LoginRequest, SignupRequest } from '../../utils/types';
import { ask } from '../../utils/helpers';

export class AuthView {
    showWelcome(): void {
        console.log("\n=== Welcome to News Aggregation ===");
    }

    async getLoginDetails(): Promise<LoginRequest> {
        const email = await ask("Email: ");
        const password = await ask("Password: ");
        return { email, password };
    }

    async getSignupDetails(): Promise<SignupRequest> {
        const username = await ask("Username: ");
        const email = await ask("Email: ");
        const password = await ask("Password: ");
        return { username, email, password };
    }

    showMessage(message: string): void {
        console.log(`${message}`);
    }
}
