import jwt from "jsonwebtoken";
import userModel from "../model/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "kosisi_secret_jwt_key_2026";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No authentication token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user && (req.user.role === "admin" || req.user.email === "kosisiwear@gmail.com")) {
      return next();
    }
    return res.status(403).json({ message: "Access forbidden. High-security admin privileges required." });
  });
};

export { JWT_SECRET };
