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
