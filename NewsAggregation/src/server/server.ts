import ServerController from './controllers/serverController';
import dotenv from "dotenv";

dotenv.config();
const defaultServerPort = '5000';
const serverPort = process.env.PORT || defaultServerPort;

const serverController = new ServerController(parseInt(serverPort));
serverController.initializeServer();
