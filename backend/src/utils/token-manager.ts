import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

// Ensure JWT_SECRET exists and is not null/undefined
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// ------------------
// CREATE TOKEN 
// ------------------
export const createToken = (
  id: string,
  email: string,
  expiresIn: string | number
) => {
  const payload = { id, email };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: expiresIn as any
  });
};

// ------------------
// VERIFY TOKEN 
// ------------------
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Token Expired" });
    }

    res.locals.jwtData = decoded;
    return next();
  });
};