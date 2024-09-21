const contactsRouter = require("express").Router();
const Contact = require("../models/contact");
const logger = require("../utils/logger");

contactsRouter.get("/", (req, res, next) => {
  Contact.find({})
    .then((contacts) => res.json(contacts))
    .catch((err) => next(err));
});

contactsRouter.get("/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      contact ? res.json(contact) : res.status(404).end();
    })
    .catch((err) => next(err));
});

contactsRouter.post("/", (req, res, next) => {
  const { name, number } = req.body;

  new Contact({ name, number })
    .save()
    .then((savedContact) => res.json(savedContact))
    .catch((err) => next(err));
});

contactsRouter.put("/:id", (req, res, next) => {
  const { name, number } = req.body;

  const opts = { new: true, runValidators: true, context: "query" };

  Contact.findByIdAndUpdate(req.params.id, { name, number }, opts)
    .then((updatedContact) => res.json(updatedContact))
    .catch((err) => next(err));
});

contactsRouter.delete("/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      // logger.info(result);
      res.status(204).end();
    })
    .catch((err) => next(err));
});

module.exports = contactsRouter;
