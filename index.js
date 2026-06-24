require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./models/person");

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_DB_URL, { family: 4 });

app.use(express.json());
app.use(express.static("dist"));

morgan.token("data", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data"),
);

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phoneBook.find((n) => n.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;
  Person.findById(req.params.id)
    .then((person) => {
      if (!person) return res.status(404).end();
      person.name = name;
      person.number = number;
      return person.save().then((updatedPerson) => res.json(updatedPerson));
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  return Person.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res) =>
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => next(err)),
);

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });
  if (!number) return res.status(400).json({ error: "number is required" });

  const newPerson = new Person({
    name: name,
    number: number,
  });

  newPerson
    .save()
    .then((person) => res.json(person))
    .catch((err) => next(err));
});

app.get("/info", (req, res) =>
  res.send(
    `<p> Phonebook has info for ${phoneBook.length} people </p> 
    <p> ${new Date()} </p> `,
  ),
);

app.get("/", (req, res) => res.json({ name: "PhoneBook API" }));

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server is running "));
