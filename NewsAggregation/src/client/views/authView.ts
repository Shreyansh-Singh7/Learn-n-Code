import readline from 'readline';
import { ClientAuthService } from '../services/clientAuthService';
import { UserSession } from '../userSession';
import { IUser } from '../../utils/types';
import { hashPassword } from '../../utils/helpers';

export class ConsoleHelper {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    ask(query: string): Promise<string> {
        return new Promise(resolve => {
            this.rl.question(query, (ans) => {
                resolve(ans.trim());
            });
        });
    }

    close(): void {
        this.rl.close();
    }
}

export class AuthView {
    private helper: ConsoleHelper;

    constructor(private clientService: ClientAuthService) {
        this.helper = new ConsoleHelper();
    }

    showWelcome(): void {
        console.log("\n=== News Aggregation ===");
    }

    async promptMainMenu(): Promise<string> {
        console.log("\n1. Login");
        console.log("2. Signup");
        console.log("0. Exit");
        return await this.helper.ask("Choose an option: ");
    }

    async handleLogin(): Promise<void> {
        try {
            const email = await this.helper.ask("Email: ");
            const password = await this.helper.ask("Password: ");
            const hashedPassword = hashPassword(password);
            const user = await this.clientService.login({ email, password });
            UserSession.setUser(user);
            console.log(`\n Welcome back, ${user.username}!`);
        } catch (err: any) {
            console.log(`Login failed: ${err.message}`);
        }
    }

    async handleSignup(): Promise<void> {
        try {
            const username = await this.helper.ask("Username: ");
            const email = await this.helper.ask("Email: ");
            const password = await this.helper.ask("Password: ");
            const hashedPassword = hashPassword(password);
            const user = await this.clientService.signup({ username, email, password });
            UserSession.setUser(user);
            console.log(`\nAccount created. Welcome, ${user.username}!`);
        } catch (err: any) {
            console.log(`Signup failed: ${err.message}`);
        }
    }

    async routeToRoleDashboard(user: IUser): Promise<void> {
        switch (user.role_id) {
            case 1:
                await this.userDashboard(user);
                break;
            case 2:
                await this.adminDashboard(user);
                break;
            default:
                console.log("Unknown role. Access denied.");
        }
    }

    private async userDashboard(user: IUser): Promise<void> {
        console.log(`\nUser Dashboard - Welcome ${user.username}`);
    }

    private async adminDashboard(user: IUser): Promise<void> {
        console.log(`\nAdmin Dashboard - Welcome Admin ${user.username}`);
    }
}
