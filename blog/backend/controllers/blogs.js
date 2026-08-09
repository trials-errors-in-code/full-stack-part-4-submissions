import express from "express";
import logger from "../utils/logger.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import fs from "node:fs";
import jwt from "jsonwebtoken";
import config from "../utils/config.js";
import middleware from "../utils/middleware.js";

const SECRET = config.SECRET;

// const getToken = (request) => {
//   const authorization = request.get("authorization").split(" ");
//   if (authorization[0] === "Bearer") {
//     return authorization[1];
//   }
//   return null;
// };

const blogsRouter = express.Router();

blogsRouter.get("/", async (req, res) => {
  let data = await Blog.find({}).populate("user");
  res.json(data);
});

blogsRouter.post("/", middleware.userExtractor, async (req, res) => {
  // const decodedToken = jwt.verify(getToken(req), SECRET);

  // const decodedToken = jwt.verify(req.token, SECRET);
  // if (!decodedToken.id) {
  //   return res.status(400).json({ error: "invalid token" });
  // }

  if (!req.user) {
    return res.status(401).json({ error: "missing or invalid token" });
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ error: "userId missing or invalid" });
  }

  // if (!user) {
  //   return res.json({ error: "userId missing or Invalid" });
  // }

  const { title, author, url, likes } = req.body;
  // const users = await User.find({});
  // let userIndex = Math.floor(Math.random() * users.length);
  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    // user: users[userIndex]._id,
    user: user._id,
  });
  await blog.save();
  // const user = await User.findById(user._id);
  user.blogs = user.blogs.concat(blog._id);
  await user.save();
  await blog.populate("user");
  res.status(201).json(blog);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const blogId = req.params.id;
  // const decodedToken = jwt.verify(req.token, SECRET);
  // if (!decodedToken.id) {
  //   res.status(400).json({ error: "invalid token" });
  // }
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.json({ error: "userId missing or invalid" });
  }
  const userId = user._id;
  const blog = await Blog.findById(blogId);
  if (userId.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(blogId);
    res.status(204).end();
  } else {
    res.status(401).json({
      error: "user mismatch\noperation not allowed",
    });
  }
});

blogsRouter.put("/:id", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const id = req.params.id;
  const blog = await Blog.findById(id);
  blog.title = title;
  blog.author = author;
  blog.url = url;
  blog.likes = likes || 0;
  const updatedBlog = await blog.save();
  res.json(updatedBlog);
});

export default blogsRouter;
