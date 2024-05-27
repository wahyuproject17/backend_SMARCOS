const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

function generateJWT(email, userLevel) {
    const token = jwt.sign({ email, level: userLevel }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = generateJWT;
