const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

function generateJWT({ email, level, userid }) {
    const token = jwt.sign({ email, level, userid }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

module.exports = generateJWT;
