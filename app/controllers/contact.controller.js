exports.create = (_req, res) => {
    res.send({ message: "create handler" });
};

exports.findAll = (_req, res) => {
    res.send({ message: "findAll handler" });
};

exports.findOne = (_req, res) => {
    res.send({ message: "findOne handler" });
};

exports.update = (req, res) => {
    res.send({ message: "update handler" });
};

exports.delete = (_req, res) => {
    res.send({ message: "delete handler" });
};

exports.deleteAll = (_req, res) => {
    res.send({ message: "deleteAll handler" });
};

exports.findAllFavorite = (_req, res) => {
    res.send({ message: "findAllFavorite handler" });
};
