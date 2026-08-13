import jwt from "jsonwebtoken";
import express from "express";
import config from "../utils/config.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const SECRET = config.SECRET;

const loginRouter = express.Router();
loginRouter.post("/", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      error:
        "enter at least 8 letters for password and 3 for username to be valid ",
    });
  }
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isPasswordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && isPasswordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userForToken, SECRET, {
    expiresIn: 500,
  });
  res.status(200).send({ token, username: user.username, name: user.name });
});
export default loginRouter;
