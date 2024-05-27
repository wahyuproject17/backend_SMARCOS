const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
}

// Example usage
const secretKey = generateSecretKey();
console.log("JWT Secret Key:", secretKey);
