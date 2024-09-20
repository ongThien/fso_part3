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
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnObj) => {
    (returnObj.id = returnObj._id.toString()), delete returnObj._id;
    delete returnObj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
