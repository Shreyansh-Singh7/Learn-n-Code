import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../../database/db.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const DEFAULT_CATEGORIES = [
  "business",
  "entertainment",
  "sports",
  "technology",
];

export async function signup(req: any, res: any) {
  const { username, email, password } = req.body;
  const db = await getDb();

  if (!username || !email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: "Invalid email format" });

  const existing = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (existing) return res.status(409).json({ error: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const result = await db.run(
    `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
    [username, email, hash, "user"]
  );

  const userId = result.lastID;

  // ✅ Add default category preferences (enabled by default)
  const insertPromises = DEFAULT_CATEGORIES.map((category) => {
    return db.run(
      `INSERT INTO notification_preferences (user_id, category, enabled) VALUES (?, ?, ?)`,
      [userId, category, 1] // 1 = enabled
    );
  });

  await Promise.all(insertPromises);

  return res.status(201).json({ message: "User registered successfully" });
}

export async function login(req: any, res: any) {
  const { email, password } = req.body;
  const db = await getDb();

  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "2h",
  });
  return res.json({ token, role: user.role });
}
