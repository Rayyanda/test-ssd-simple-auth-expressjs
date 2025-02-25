import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config()

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Akses ditolak! Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan user di request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token tidak valid!" });
  }
};
