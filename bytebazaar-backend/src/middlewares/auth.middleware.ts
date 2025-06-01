// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthPayload extends JwtPayload {
  userId: string;
  name: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
      };
    }
  }
}

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    if (typeof decoded === "object" && "userId" in decoded) {
      req.user = {
        userId: (decoded as AuthPayload).userId,
        name: (decoded as AuthPayload).name
      };
      next();
    }
    else {
      console.error("Invalid token payload structure:", decoded);
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
