import express from "express";
import { body, validationResult } from "express-validator";
import { verifyToken, verifyUser } from "../lib/middleware";
import { createUser, loginUser, Status } from "../lib/userService";
const router = express.Router();

router.post("/login", async (req, res) => {
  const authResponse = await loginUser(req.body);
  if (authResponse.status === Status.FAILURE)
    res.status(401).send(authResponse);
  else {
    res
      .status(200)
      .send({ user: authResponse.data, token: authResponse.token });
  }
});

router.post(
  "/signup",
  body("name").trim(),
  body("password").exists(),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userCrudResponse = await createUser(req.body);

    if (userCrudResponse.status === Status.SUCCESS) {
      delete userCrudResponse.data.password;
      res.status(200).send(userCrudResponse.data);
    } else res.status(500).send(userCrudResponse.error);
  }
);

router.use("/verify", verifyToken);

router.use("/verify/:username", verifyToken, verifyUser);

export default router;
