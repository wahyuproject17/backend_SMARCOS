const { hashPassword } = require('../utils/hashPassword');
const pool = require('../initializers/database'); // Import pool dari database.js
const generateJWT = require('../config/generateJWT');
const jwt = require('jsonwebtoken');
require('dotenv').config();

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = {
    async Login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (email && password) {
            try {
                // Cek apakah pengguna adalah admin
                const [adminResults] = await pool.query(
                    `SELECT * FROM tbl_admin WHERE email = ?`,
                    [email]
                );

                if (adminResults.length > 0) {
                    if (adminResults[0].password === hashPassword(password)) {
                        const username = adminResults[0].username;
                        const token = generateJWT({
                            email: email,
                            level: 1,
                            userid: adminResults[0].id_admin,
                            username: username
                        }, process.env.ADMIN_JWT_SECRET);

                        res.header('Authorization', `Bearer ${token}`);
                        return res.json({
                            success: true,
                            level: 1,
                            token: token,
                            message: 'Login berhasil sebagai admin',
                            username: username
                        });
                    } else {
                        return res.json({ success: false, message: 'Email atau password anda salah!' });
                    }
                } else {
                    // Cek apakah pengguna adalah user
                    const [userResults] = await pool.query(
                        `SELECT * FROM tbl_user WHERE email = ?`,
                        [email]
                    );

                    if (userResults.length > 0) {
                        if (userResults[0].password === hashPassword(password)) {
                            const username = userResults[0].username;
                            const token = generateJWT({
                                email: email,
                                level: 2,
                                userid: userResults[0].id_user,
                                username: username
                            }, process.env.USER_JWT_SECRET);

                            res.header('Authorization', `Bearer ${token}`);
                            return res.json({
                                success: true,
                                level: 2,
                                token: token,
                                message: 'Login berhasil sebagai user',
                                username: username,
                                id: userResults[0].id_user
                            });
                        } else {
                            return res.json({ success: false, message: 'Email atau password anda salah!' });
                        }
                    } else {
                        return res.json({ success: false, message: 'Email atau password anda salah!' });
                    }
                }
            } catch (error) {
                console.error('Database connection or query error:', error);
                return res.json({ success: false, message: 'Query error' });
            }
        } else {
            return res.json({ success: false, message: 'Masukkan email dan password!' });
        }
    },

    Logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return res.json({ success: false, message: 'Logout gagal' });
            }
            res.clearCookie('secretname');
        });
    },

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        const secretKey = req.user && req.user.level === 1 ? process.env.ADMIN_JWT_SECRET : process.env.USER_JWT_SECRET;

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }
};
