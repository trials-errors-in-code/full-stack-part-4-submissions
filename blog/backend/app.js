import express from "express";
import blogsRouter from "./controllers/blogs.js";
import mongoose from "mongoose";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middleware from "./utils/middleware.js";
import usersRouter from "./controllers/users.js";
import loginRouter from "./controllers/login.js";

const app = express();

app.use(express.json());

logger.info(`connecting to ${config.PORT}`);
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("connected to MONGODB blogDB");
  })
  .catch((error) => logger.error("error connecting", error.message));

app.use(express.static("dist"));

if (process.env.NODE_ENV !== "test") {
  app.use(middleware.requestLogger);
}
app.use(middleware.tokenExtractor);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
