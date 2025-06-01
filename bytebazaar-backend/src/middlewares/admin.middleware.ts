// src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      res.status(403).json({ message: "Access denied. Admins only." });
      return;
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
