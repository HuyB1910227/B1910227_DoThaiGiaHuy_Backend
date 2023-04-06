const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const JWT_SECRET = require('../config/jwt_secret');
const verifyToken = (req, _res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new ApiError(401, "Unauthorized!!!!"));
    }
    try {
        const tokenDecoded = jwt.verify(token, JWT_SECRET);
        console.log(tokenDecoded);
        req.user = tokenDecoded;
        next();
    } catch (err) {
        return next(new ApiError(401, "Invalid token!"));

    }
}

module.exports = verifyToken;