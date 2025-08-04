import express from 'express';
import { IUserRepository, UserRepository } from '../repositories/userRepository';
import { AuthService, IAuthService } from '../services/authService';
import { AuthController } from '../controllers/authController';
import { IRouteModule } from './IRouteModule';

export class AuthRoutes implements IRouteModule {
    private router = express.Router();

    constructor() {
        const userRepository: IUserRepository = new UserRepository();
        const authService : IAuthService = new AuthService(userRepository);
        const authController = new AuthController(authService);
        this.router.use(authController.getRouter());
    }

    getRouter() {
        return this.router;
    }
}
