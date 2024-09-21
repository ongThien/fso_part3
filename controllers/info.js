const infoRouter = require("express").Router();
const Contact = require("../models/contact");

infoRouter.get("/", (req, res, next) => {
  Contact.find({})
    .then((contacts) => {
      const info = `Phonebook has info for ${contacts.length} people`;
      const date = new Date();
      res.send(`<p>${info}</br>${date}</p>`);
    })
    .catch((err) => next(err));
});

module.exports = infoRouter;
