require("dotenv").config();
const { sign } = require('jsonwebtoken');

async function generateToken(user){
    return sign({
        user: user
    }, process.env.JWT_SECRET, {
        expiresIn: 86400,
    });
};

module.exports = generateToken;