const crypto = require('crypto');
module.exports = {
    hashPassword(password) {
        const hash = crypto.createHash('sha512');
        // Meng-update hash dengan password
        hash.update(password);
        // Mendapatkan hasil hash dalam format hexademisal
        const hashedPassword = hash.digest('hex');
        return hashedPassword;
}
}