const express = require("express");
const app = express();
// const morgan = require("morgan");
const cors = require("cors");
const contactsRouter = require("./controllers/contacts");
const infoRouter = require("./controllers/info");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = config.MONGO_URI;

logger.info("connecting to", url);

mongoose
  .connect(url)
  .then((result) => logger.info("connected"))
  .catch((err) =>
    logger.error("error connecting to mongoDB:", err.message)
  );

const corsOptions = {
  // origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.static("dist"));
app.use(express.json());

// app.use(
//   morgan("tiny", {
//     skip: (req, res) => req.method === "POST",
//   })
// );

// morgan.token(
//   "data",
//   (req, res) => `{"name":${req.body.name}, "number":${req.body.number}}`
// );
// app.use(
//   morgan(
//     ":method :url :status :res[content-length] - :response-time ms :data",
//     { skip: (req, res) => req.method !== "POST" }
//   )
// );
app.use(middleware.reqLogger);
app.use("/api/contacts", contactsRouter);
app.use("/api/info", infoRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;