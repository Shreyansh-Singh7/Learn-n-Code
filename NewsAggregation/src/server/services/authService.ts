import * as bcrypt from 'bcrypt';
import User from '../models/user';
import { IUserRepository } from '../repositories/userRepository';

export interface IAuthService {
    login(email: string, password: string): Promise<User>;
    signup(username: string, email: string, password: string): Promise<User>;
    validateUser(email: string, username: string): Promise<boolean>;
}

export class AuthService implements IAuthService {
    constructor(private userRepository: IUserRepository) { }

    async login(email: string, password: string): Promise<User> {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(password, user.getHashedPassword());
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return user;
    }

    async signup(username: string, email: string, password: string): Promise<User> {
        if (!username || !email || !password) {
            throw new Error('All fields are required');
        }
        const existingUser = await this.userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        if (username.length < 3) {
            throw new Error('Username must be at least 3 characters long');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await this.userRepository.getNextUserId();
        const user = new User(userId, username, email, hashedPassword, 2);
        await this.userRepository.saveUser(user);
        return user;
    }

    async validateUser(email: string, username: string): Promise<boolean> {
        const existingUser = await this.userRepository.findUserByEmail(email);
        return !existingUser && username.length >= 3;
    }
}
