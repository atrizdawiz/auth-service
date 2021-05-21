import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { verifyToken, verifyUser } from "./lib/middleware";
import authRoute from "./routes/auth";

const app = express();
declare global {
  namespace Express {
    interface Request {
      userData: any;
    }
  }
}
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/", authRoute);

const port = 5000;

app.get("/", (_, res) => {
  res.status(200).send(
    `<h1>Tjena!</h1>
  <h2>api in full effect</h2>`
  );
});

app.listen(port, () => console.log(`Running on port ${port}`));
