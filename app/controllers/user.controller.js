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
        const {name, email} = req.body;
        const userService = new UserService(MongoDB.client);
        const checkName  = await userService.findByName(name);
        if (checkName != null) {
            return res.send({status: "fail", message: "Tên đăng nhập đã được sử dụng"});
        } 
        const checkEmail = await userService.findByEmail(email);
        if (checkEmail != null) {
            return res.send({status: "fail", message: "Email đã được sử dụng"});
        }
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
        return next(new ApiError(400, "Invalid login"));
    }
    try {
        const {username, password} = req.body;
        const userService = new UserService(MongoDB.client);
        const document = await userService.findByName(username);
        console.log(document);
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
            const rs = await userService.updateToken(document._id, token);
            if (rs != null) {
                return res.send({ status: 'success', token: token });
            }  
        }
        return next(new ApiError(400, "Invalid username/password!"));
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while checking login!")
        );
    }
}


exports.logout = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          return next(new ApiError(401, "Unauthorized"));
        }
        const token = authHeader.split(" ")[1];
        const tokenDecoded = jwt.decode(token);
        const userService = new UserService(MongoDB.client);
        await userService.updateToken(tokenDecoded.id, "");
        return res.send({ status: "success" });
      } catch (error) {
        console.error(error);
        return next(new ApiError(500, "An error occurred while signing out"));
      }
}
