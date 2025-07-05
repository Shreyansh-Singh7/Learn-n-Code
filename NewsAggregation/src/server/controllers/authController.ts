import bcrypt from "bcryptjs";
import { AuthService } from "../services/authService.ts";
import { getDb } from "../../database/db.ts";

export class AuthController {
  private service = new AuthService();

  async signup(req: any, res: any) {
    try {
      const { username, email, password } = req.body;
      const result = await this.service.signup(username, email, password);
      res.status(201).json({ message: "User created", userId: result.userId });
    } catch (error: any) {
      const message = error.message || "Signup failed";
      const status = message === "User already exists" ? 409 : 400;
      res.status(status).json({ error: message });
    }
  }

  async login(req: any, res: any) {
    try {
      const { email, password } = req.body;
      console.log("[Login] Email:", email);
      const db = await getDb();

      const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
      if (!user) {
        console.log("[Login] No user found for email:", email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log("[Login] Stored hash:", user.password);
      const valid = await bcrypt.compare(password, user.password);
      console.log("[Login] Password valid:", valid);

      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      const token = this.service.generateToken({ userId: user.id, role: user.role });
      res.json({ token, role: user.role });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  }
}
