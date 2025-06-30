// src/server/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  console.log("Verifying with secret:", process.env.JWT_SECRET || "secret_key");
  console.log("Token:", token);

  jwt.verify(
    token,
    process.env.JWT_SECRET || "secret_key",
    (err: any, user: any) => {
      if (err)
        return res.status(403).json({ error: "Forbidden: Invalid token" });

      req.user = user; // Attach decoded user to request
      console.log("Decoded user:", user);
      next();
    }
  );
}

export function requireAdmin(req: any, res: any, next: any) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
