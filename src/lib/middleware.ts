import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    req.userData = decoded;
    res.send(req.userData);
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.userData.username !== req.params.username) {
    res.status(401).json({ message: "Token does not match user" });
  }
  next();
};
