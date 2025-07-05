import dotenv from "dotenv";
import ServerController from "./controllers/serverController";
import { initializeDatabase } from "../database/init"; 

dotenv.config();

const defaultPort = "5000";
const port = process.env.PORT || defaultPort;

async function start() {
  await initializeDatabase(); // ✅ Initialize DB schema
  const serverController = new ServerController(parseInt(port));
  serverController.initializeServer();
}

start();
