import express from "express";
import mongoose from "mongoose";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middleware from "./utils/middleware.js";

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

export default app;
