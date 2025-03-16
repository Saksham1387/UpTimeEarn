import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded= jwt.verify(token, process.env.JWT_SECRET!);
    if(!decoded || !decoded.sub) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    
    req.userId = decoded.sub as string;

    next();
}
