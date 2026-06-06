const express = require("express");
const app = express();

app.use(express.json());

let phoneBook = [
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
  let val;
  const ids = phoneBook.map((n) => Number(n.id));
  do {
    val = Math.random() * 1000;
  } while (ids.includes(val));
  return Math.trunc(val);
};

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phoneBook.find((n) => n.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phoneBook = phoneBook.filter((n) => n.id !== id);
  res.status(204).end();
});

app.get("/api/persons", (req, res) => res.json(phoneBook));

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  const newPerson = {
    name: name,
    number: number,
    id: generateId(),
  };
  phoneBook = phoneBook.concat(newPerson);
  res.json(newPerson);
});

app.get("/info", (req, res) =>
  res.send(
    `<p> Phonebook has info for ${phoneBook.length} people </p> 
    <p> ${new Date()} </p> `,
  ),
);

app.get("/", (req, res) => res.json({ name: "PhoneBook API" }));

const PORT = 3001;
app.listen(PORT, () => console.log("Server is running "));
