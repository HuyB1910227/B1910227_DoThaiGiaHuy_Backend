const express = require("express");
const contacts = require("../controllers/user_contact.controller");


const router = express.Router();

router.route("/")
    .get(contacts.findAllContacts)
    .post(contacts.createContact)
    .delete(contacts.deleteAllContacts);

router.route("/favorite")
    .get(contacts.findAllFavoriteContacts);

router.route("/:id")
    .get(contacts.findOneContact)
    .put(contacts.updateContact)
    .delete(contacts.deleteContact);

module.exports = router; 