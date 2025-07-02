import dotenv from "dotenv";
import ServerController from "./controllers/serverController.ts";

dotenv.config();

const defaultPort = "5000";
const port = process.env.PORT || defaultPort;

const serverController = new ServerController(parseInt(port));
serverController.initializeServer();
