import logger from "./logger.js";

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method);
  logger.info("Path", req.path);
  logger.info("Body", req.body);
  logger.info("---");
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
export default { requestLogger, errorHandler, unknownEndpoint };
