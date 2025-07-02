import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/authRepository.ts";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const DEFAULT_CATEGORIES = ["business", "entertainment", "sports", "technology"];

export class AuthService {
  private repository = new AuthRepository();

  async signup(username: string, email: string, password: string) {
    if (!username || !email || !password) {
      throw new Error("Missing fields");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const existingUser = await this.repository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await this.repository.createUser(username, email, passwordHash);
    if (typeof userId !== "number") {
      throw new Error("Failed to create user: invalid user ID");
    }
    await this.repository.addDefaultPreferences(userId, DEFAULT_CATEGORIES);

    return { userId };
  }

  generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }
}
