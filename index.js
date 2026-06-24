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

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((result) =>
    res.status(204).end(),
  );
});

app.get("/api/persons", (req, res) =>
  Person.find({}).then((persons) => res.json(persons)),
);

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name) return res.status(400).json({ error: "name is required" });
  if (!number) return res.status(400).json({ error: "number is required" });

  const newPerson = new Person({
    name: name,
    number: number,
  });

  newPerson.save().then((person) => res.json(person));
});

app.get("/info", (req, res) =>
  res.send(
    `<p> Phonebook has info for ${phoneBook.length} people </p> 
    <p> ${new Date()} </p> `,
  ),
);

app.get("/", (req, res) => res.json({ name: "PhoneBook API" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server is running "));
