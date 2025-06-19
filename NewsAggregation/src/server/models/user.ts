export default class User {
    private userId: number;
    private username: string;
    private email: string;
    private hashedPassword: string;
    private role_id: number;

    constructor(userId: number, username: string, email: string, hashedPassword: string, role_id: number) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.role_id = role_id;
    }

    getUserId(): number {
        return this.userId;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getHashedPassword(): string {
        return this.hashedPassword;
    }

    getRoleId(): number {
        return this.role_id;
    }
}
