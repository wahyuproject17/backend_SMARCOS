const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    isLogin(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'Token not provided' });
        }

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Token is not valid' });
            }
            req.user = user;
            next(); // Lanjutkan ke middleware berikutnya
        });
    },

    isLogout(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            next(); // Lanjutkan ke middleware berikutnya jika tidak ada token
        } else {
            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) {
                    next(); // Lanjutkan ke middleware berikutnya jika token tidak valid
                } else {
                    res.redirect('/'); // Redirect ke halaman utama jika sudah login
                }
            });
        }
    }
};
