import logger from "./logger.js";
import config from "./config.js";
import jwt from "jsonwebtoken";
const SECRET = config.SECRET;

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method);
  logger.info("Path", req.path);
  logger.info("Body", req.body);
  logger.info("---");
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.split(" ")[1];
  } else {
    request.token = null;
  }
  next();
};
const userExtractor = (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, SECRET);
    if (!decodedToken.id) {
      return res.status(400).json({ error: "invalid token" });
    }

    if (decodedToken.id && decodedToken.username) {
      req.user = { username: decodedToken.username, id: decodedToken.id };
    } else req.user = null;
  }
  next();
};
const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send("malformatted id");
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: "unknown endpoint" });
};
export default {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
};
