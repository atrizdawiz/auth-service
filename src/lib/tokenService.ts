import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (username: string) =>
  jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: "12h" });

export default { generateAccessToken };
