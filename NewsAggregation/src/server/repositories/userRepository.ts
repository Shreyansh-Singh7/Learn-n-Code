import { Pool, RowDataPacket } from 'mysql2/promise';
import User from '../models/user';
import { getDbPool } from '../config/database';

export interface IUserRepository {
    saveUser(user: User): Promise<void>;
    findUserByEmail(email: string): Promise<User | undefined>;
    getNextUserId(): Promise<number>;
    getRoles(): Promise<{ role_id: number; role_name: string }[]>;
    getAllUsers(): Promise<User[]>
}

export class UserRepository implements IUserRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async saveUser(user: User): Promise<void> {
        const query = `
      INSERT INTO users (user_id, username, email, password_hash, role_id)
      VALUES (?, ?, ?, ?, ?)
    `;
        const values = [
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getHashedPassword(),
            user.getRoleId(),
        ];
        await this.pool.execute(query, values);
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query, [email]);
        if (rows.length === 0) {
            return undefined;
        }
        const row = rows[0];
        return new User(row.user_id, row.username, row.email, row.password_hash, row.role_id);
    }

    async getNextUserId(): Promise<number> {
        const query = 'SELECT MAX(user_id) as max FROM users';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query);
        const maxId = rows[0].max || 0;
        return maxId + 1;
    }

    async getRoles(): Promise<{ role_id: number; role_name: string }[]> {
        const query = 'SELECT role_id, role_name FROM roles';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query);
        return rows.map((row) => ({ role_id: row.role_id, role_name: row.role_name }));
    }

    async getAllUsers(): Promise<User[]> {
        const query = 'SELECT * FROM users WHERE role_id = 2';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query);

        return rows.map(row => new User(
            row.user_id,
            row.username,
            row.email,
            row.password_hash,
            row.role_id
        ));
    }
}
