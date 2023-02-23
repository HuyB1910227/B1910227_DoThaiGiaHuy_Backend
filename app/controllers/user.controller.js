const UserService = require('../services/user.service');
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/jwt_secret');

exports.register = async (req, res, next) => {
    if (!req.body?.name || !req.body?.email || !req.body?.password) { 
        return next(new ApiError(400, "Invalid register!"));
    }
    
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(`Inserted new user have Id: ${document.insertedId}`);
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while creating the user!")
        );
    }
}



exports.login = async (req, res, next) => {
    if (!req.body?.username || !req.body?.password) { 
        return next(new ApiError(400, "Invalid register"));
    }

    try {
        const {username, password} = req.body;
        const userService = new UserService(MongoDB.client);
        const document = await userService.findByName(username);
        const comparePass = await bcrypt.compare(password, document.password);
        if(comparePass) {
            const token = jwt.sign(
                {
                    id: document._id,
                },
                JWT_SECRET,
                {
                    expiresIn: 900000
                }
            );
            return res.send({ status: 'success', token: token });
        }
        return next(new ApiError(400, "Invalid username/password!"));
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while checking login!")
        );
    }
}

