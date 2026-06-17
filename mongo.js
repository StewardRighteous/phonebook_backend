const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Enter password");
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://stewardt004_db_user:${password}@cluster0.clyitln.mongodb.net/phoneBookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("Phone Book:");
  Person.find({}).then((res) => {
    res.forEach((p) => console.log(`${p.name} ${p.number}`));
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const newPerson = new Person({
    name: name,
    number: number,
  });
  newPerson.save().then((res) => {
    console.log(`Added ${res.name} ${res.number} to phonebook`);
    mongoose.connection.close();
  });
}
