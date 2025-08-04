import express, { Router, Request, Response } from 'express';
import { IAuthService } from '../services/authService';
import User from '../models/user';
import { LoginRequest, SignupRequest } from '../../utils/types';


export class AuthController {
    private router: Router;
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.router = express.Router();
        this.authService = authService;
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/login', this.handleLogin.bind(this));
        this.router.post('/signup', this.handleSignup.bind(this));
    }

    public getRouter(): Router {
        return this.router;
    }

    private async handleLogin(request: Request, response: Response): Promise<void> {
        try {
            const body: LoginRequest = request.body;
            if (!body.email || !body.password) {
                response.status(400).json({ success: false, error: 'Email and password are required' });
                return;
            }
            const user: User = await this.authService.login(body.email, body.password);
            response.status(200).json({
                success: true,
                data: {
                    userId: user.getUserId(),
                    username: user.getUsername(),
                    email: user.getEmail(),
                    role_id: user.getRoleId(),
                },
            });
        } catch (error: any) {
            response.status(401).json({ success: false, error: error.message });
        }
    }

    private async handleSignup(request: Request, response: Response): Promise<void> {
        try {
            const body: SignupRequest = request.body;
            if (!body.username || !body.email || !body.password) {
                response.status(400).json({ success: false, error: 'All fields are required' });
                return;
            }
            const isValid = await this.authService.validateUser(body.email, body.username);
            if (!isValid) {
                response.status(400).json({ success: false, error: 'Invalid email or username' });
                return;
            }
            const user: User = await this.authService.signup(body.username, body.email, body.password);
            response.status(201).json({
                success: true,
                data: {
                    userId: user.getUserId(),
                    username: user.getUsername(),
                    email: user.getEmail(),
                    role_id: user.getRoleId(),
                },
            });
        } catch (error: any) {
            response.status(400).json({ success: false, error: error.message });
        }
    }
}
