import { AppController } from "./controllers/appController";

(async () => {
    const app = new AppController();
    await app.run();
})();
