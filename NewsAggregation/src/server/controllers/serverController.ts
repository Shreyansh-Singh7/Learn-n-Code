import express, { Express } from 'express';
import http from 'http';
import { IAuthService, AuthService } from '../services/authService';
import { AuthController } from '../controllers/authController';
import { IUserRepository, UserRepository } from '../repositories/userRepository';
import { getDbPool, closeDbPool } from '../config/database';

export default class ServerController {
    private app: Express;
    private port: number;
    private server: http.Server | null = null;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    public async initializeServer(): Promise<void> {
        try {
            const pool = getDbPool();
            await pool.query('SELECT 1');
            console.log('Database connected');
        } catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }

        this.app.use(express.json());

        const userRepository: IUserRepository = new UserRepository();
        const authService: IAuthService = new AuthService(userRepository);

        const authController = new AuthController(authService);

        this.app.use('/api', authController.getRouter());

        this.app.use((request, response) => {
            response.status(404).json({ success: false, error: 'Route not found' });
        });

        this.app.use((err: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            response.status(500).json({ success: false, error: 'Internal server error' });
        });

        this.server = this.app.listen(this.port, () => console.log(`Server running on port ${this.port}`));
    }

    public async close(): Promise<void> {
        if (this.server) {
            this.server.close();
        }
        await closeDbPool();
    }
}
