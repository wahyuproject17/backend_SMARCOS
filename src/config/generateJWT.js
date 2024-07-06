const jwt = require('jsonwebtoken');

const generateJWT = (payload, secretKey) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

module.exports = generateJWT;
