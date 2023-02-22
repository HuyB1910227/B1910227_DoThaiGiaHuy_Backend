const express = require('express');
const cors = require('cors');
const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

const userRouter = require("./app/routes/user.route");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({message: "Hi there! Welcome to contact book application."});
});
app.use("/api/contacts", contactsRouter);

//
app.use("/api/user", userRouter);

//Middleware
app.use((_req, _res, next) => {
    return next(new ApiError(404, "Resource not found!"));
});

app.use((err, _req, res, _next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});
module.exports = app;
