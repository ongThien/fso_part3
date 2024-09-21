require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => console.log("connected"))
  .catch((error) => console.log("error connecting to mongoDB:", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length >= 3,
      message: (props) => `must be at least 3 characters`
    },
    required: [true, "contact's name is required"],
  },
  number: {
    type: String,
    validate: {
      // phone number with minLength = 8, be formed of two parts that are separated by a dash(-)
      // the first part has two or three numbers and the second part also consists of numbers
      // so the regex can be constructed as: ^[0-9]{2,3}-[0-9]{5,}$, explaination below:
      // ^: Anchors the match at the start of the phone number string.
      // [0-9]{2,3}: The first part must be 2 or 3 digits.
      // -: A literal dash (-) separating the two parts.
      // [0-9]{5,}: The second part must have at least 5 digits.
      // $: Anchors the match at the end of the phone number string.
      validator: (v) => /^[0-9]{2,3}-[0-9]{5,}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "contact's phone number is required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
    delete returnObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
