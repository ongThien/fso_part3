const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId = Math.floor(Math.random() * persons.length * 100000);
  return String(maxId);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

app.use(express.json());
app.use(
  morgan("tiny", {
    skip: (req, res) => req.method === "POST",
  })
);

morgan.token("data", (req, res) => {
  if (req.method === "POST") {
    return `{"name":${req.body.name}, "number":${req.body.number}}`;
  }
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :data",
    { skip: (req, res) => req.method !== "POST" }
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((n) => n.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  const nameExist = persons.find((p) => p.name === body.name);
  console.log(nameExist);

  if (nameExist) {
    return res.status(409).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((n) => n.id !== id);
  console.log("resource deleted");

  res.status(204).end();
});

app.get("/api/info", (req, res) => {
  const info = `Phonebook has info for ${persons.length} people`;
  const date = new Date();
  res.send(`<p>${info}</br>${date}</p>`);
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
