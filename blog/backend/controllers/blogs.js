import express from "express";
import logger from "../utils/logger.js";
import Blog from "../models/blog.js";

const blogsRouter = express.Router();
blogsRouter.get('/', (req,res)=>{
  console.log("Getting api/blogs")
  Blog.find({}).then(data=>res.json(data))
})
blogsRouter.post('/',(req, res) => {
  const {title, author, url, likes}=req.body
  const blog = new Blog({
    title:title||"none",
    author:author||"none",
    url:url||"no url provided",
    likes:likes
  })
  blog.save().then(blog=>res.json(blog)).catch(error=>logger.error("error posting the data to mongo db",error.message))
})
export default blogsRouter;