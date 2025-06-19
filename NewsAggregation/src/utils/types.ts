import { IncomingMessage, ServerResponse } from 'http';
import User from '../server/models/user';

export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    connectionLimit?: number;
    waitForConnections?: boolean;
    queueLimit?: number;
}

export interface Route {
    method: string;
    path: string | RegExp;
    handler: (request: IncomingMessage, response: ServerResponse, params: any) => Promise<void>;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

export interface NotificationConfigRequest {
    userId: number;
    categoryId: number | null;
    keyword: string | null;
    isEnabled: boolean;
}

export interface SaveArticleRequest {
    userId: number;
    articleId: number;
}

export interface UpdateExternalServerRequest {
    apiKey: string;
}

export interface AddCategoryRequest {
    name: string;
}

export interface IUserRepository {
    saveUser(user: User): Promise<void>;
    findUserByEmail(email: string): Promise<User | undefined>;
    getNextUserId(): Promise<number>;
}

export interface IUser {
    userId: number;
    username: string;
    email: string;
    role_id: number;
}