require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan("tiny", {
    skip: (req, res) => req.method === "POST",
  })
);

morgan.token(
  "data",
  (req, res) => `{"name":${req.body.name}, "number":${req.body.number}}`
);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :data",
    { skip: (req, res) => req.method !== "POST" }
  )
);

const corsOptions = {
  // origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  new Person({ name, number })
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  const opts = { new: true, runValidators: true, context: "query" };

  Person.findByIdAndUpdate(req.params.id, { name, number }, opts)
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log(result);

      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.get("/api/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const info = `Phonebook has info for ${persons.length} people`;
      const date = new Date();
      res.send(`<p>${info}</br>${date}</p>`);
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: "unknown endpoint" });

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
