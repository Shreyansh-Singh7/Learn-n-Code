import { IUser } from '../utils/types';

export class UserSession {
    private static user: IUser | null = null;

    static setUser(user: IUser): void {
        this.user = user;
    }

    static getUser(): IUser | null {
        return this.user;
    }

    static clear(): void {
        this.user = null;
    }
}
