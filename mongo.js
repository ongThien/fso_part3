const mongoose = require("mongoose");

const args = process.argv;

if (args.length < 3) {
  console.log("missing args");
  process.exit(1);
}

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = args[3];
const number = args[4];

if (args.length === 3) {
  Person.find({}).then((result) => {
    const contacts = result.map((r) => {
      return { name: r.name, number: r.number };
    });

    console.log("phonebook:");
    contacts.forEach((c) => console.log(c.name, c.number));

    mongoose.connection.close();
  });
} else if (name && number) {
  const contact = { name, number };

  new Person(contact).save().then((result) => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`);
    // console.log(result);
    mongoose.connection.close();
  });
} else {
  console.log("make sure to have the correct number of arguments");
  console.log("example: node mongo.js yourpassword Anna 040-1234556");
  console.log(
    "if the name contains whitespace characters, it must be enclosed in quotes:"
  );
  console.log(
    'example: node mongo.js yourpassword "Arto Vihavainen" 045-1232456'
  );
  mongoose.connection.close();
}
