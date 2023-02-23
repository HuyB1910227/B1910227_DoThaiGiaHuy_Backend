const express = require('express');
const cors = require('cors');
const verify = require('./app/middlewares/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");
const userRouter = require("./app/routes/user.route");
const userContacts = require("./app/routes/user_contact.route");

app.get("/", (_req, res) => {
    res.json({message: "Hi there! welcome to contact book application."});
});
app.use("/api/contacts", contactsRouter);
app.use("/api/user", userRouter);

//PHAN MO RONG
app.use("/api/V2/contacts", verify, userContacts);


app.use((req, _res, next) => {
    
    console.log(req.url);
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, _req, res, _next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});
module.exports = app;