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
app.use("/api/auth", authRoute);

const port = 5000;
app.get("/", (_, res) => {
  res.status(200).send(
    `<h1>Tjena!</h1>
  <h2>api in full effect</h2>`
  );
});

app.get(
  "/verify",
  verifyToken,
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Nice du får vara här och berätta hemlisar!");
  }
);

app.get(
  "/verify/:username",
  verifyToken,
  verifyUser,
  (req: Request, res: Response, next: NextFunction) => {
    res.send("Nice du får vara själv här! Ingen annan :)");
  }
);

app.listen(port, () => console.log(`Running on port ${port}`));
