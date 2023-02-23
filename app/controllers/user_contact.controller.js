const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");


exports.findAllContacts = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const {name} = req.query;
        const userId = req.user.id;
        if (name) {
            documents = await contactService.findByNameInContact(name, userId);
        }
        else {
            documents = await contactService.findAllContactsOfUser(userId);
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while retrieving contact")
        );
    }
    return res.send(documents);
};

exports.createContact = async (req, res, next) => {
    const userId = req.user.id;
    if (!req.body?.name) { 
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.createContact(req.body, userId);
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
}

exports.findOneContact = async (req, res, next) => {

    try {
        const userId = req.user.id;
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findByContactId(req.params.id, userId);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(
                500,
                `Error retrieving contact with id = ${req.params.id}`
            )
        );
    }
}; 


exports.updateContact = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next (new ApiError(400, "Data to update can not be empty"));
    }
    const userId = req.user.id;

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.updateContact(req.params.id, req.body, userId);
        if (!document) {
            return next (new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was updated successfully"});
    } catch (error) {
        new ApiError(
            500,
            `Error updating contact with id = ${req.params.id}`
        )
    }
};

exports.deleteContact = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.deleteContact(req.params.id, userId);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next (
            new ApiError(
                500,
                `Error deleting contact with id = ${req.params.id}`
            )
        );
    }
};

exports.deleteAllContacts = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAllContacts(userId);
        return res.send({message: `${deletedCount} contact was deleted successfully`});
    } catch (error) {
        return next (
            new ApiError(
                500,
                `An error occurred while removing all contacts`
            )
        );
    }
};

exports.findAllFavoriteContacts = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findAllFavoriteContacts(userId);
        // if (!document) {
        //     return next(new ApiError(404, "Contact not found"));
        // }
        return res.send(document);
    } catch (error) {
        return next (
            new ApiError(
                500,
                `An error occured while retrieving favorite contacts`
            )
        );
    }
};
