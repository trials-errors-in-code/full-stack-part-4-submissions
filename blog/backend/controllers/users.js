import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const usersRouter = express.Router();
usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs");
  res.json(users);
});
usersRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (!testValidity(username, password))
    return res.status(400).json({
      error: "Username and password should be at least 3 characters long.",
    });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    name,
    passwordHash,
  });
  await user.save();
  res.json(user);
});

export default usersRouter;

function testValidity(...params) {
  for (let param of params) {
    if (param && param.length < 3) {
      return false;
    }
  }
  return true;
}
