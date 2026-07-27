import express from "express";
import logger from "../utils/logger.js";
import Blog from "../models/blog.js";

let count = 1;
const blogsRouter = express.Router();

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((data) => {
    logger.info(count++ / 2);
    res.json(data);
  });
});

blogsRouter.post("/", async (req, res) => {
  const { title, author, url, likes } = req.body;
  const blog = new Blog({
    title: title,
    author: author || "none",
    url: url,
    likes: likes || 0,
  });
  await blog.save();
  res.status(201).json(blog);
});
blogsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.status(204).end();
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
