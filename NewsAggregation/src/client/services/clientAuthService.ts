import * as dotenv from 'dotenv';
import { LoginRequest, SignupRequest, IUser } from '../../utils/types';

dotenv.config();
export class ClientAuthService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async login(credentials: LoginRequest): Promise<IUser> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        return result.data as IUser;
    }

    async signup(userInfo: SignupRequest): Promise<IUser> {
        
        const response = await fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo),
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
        return result.data as IUser;
    }
}
