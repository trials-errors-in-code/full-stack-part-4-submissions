import app from "./app.js";
import config from "./utils/config.js";
import logger from "./utils/logger.js";

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

// app.get("/api/blogs", (request, response) => {
//   Blog.find({}).then((blogs) => {
//     response.json(blogs);
//   });
// });

// app.post("/api/blogs", (request, response) => {
//   const blog = new Blog(request.body);

//   blog.save().then((result) => {
//     response.status(201).json(result);
//   });
// });