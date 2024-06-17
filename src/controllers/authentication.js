const { hashPassword } = require('../utils/hashPassword');
const database = require('../initializers/database');
const mysql = require('mysql');
const generateJWT = require('../config/generateJWT');
require('dotenv').config();

let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    Login(req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (email && password) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    res.json({ success: false, message: 'Database connection error' });
                    return;
                }

                // Cek apakah pengguna adalah admin
                connection.query(`SELECT * FROM tbl_admin WHERE email = ?`, [email], function (error, adminResults) {
                    if (error) {
                        console.error('Admin query error:', error);
                        res.json({ success: false, message: 'Query error' });
                        connection.release();
                        return;
                    }

                    if (adminResults.length > 0) {
                        if (adminResults[0].password === hashPassword(password)) {
                            const token = generateJWT({ 
                                email: email, 
                                level: 1, // Level 1 untuk admin
                                userid: adminResults[0].id_admin
                            });

                            // Send the JWT token in the Authorization header
                            res.header('Authorization', `Bearer ${token}`);
                            res.json({ success: true, level: 1, token: token, message: 'Login berhasil sebagai admin' });
                        } else {
                            res.json({ success: false, message: 'Email atau password anda salah!' });
                        }
                        connection.release();
                    } else {
                        // Cek apakah pengguna adalah user
                        connection.query(`SELECT * FROM tbl_user WHERE email = ?`, [email], function (error, userResults) {
                            if (error) {
                                console.error('User query error:', error);
                                res.json({ success: false, message: 'Query error' });
                                connection.release();
                                return;
                            }

                            if (userResults.length > 0) {
                                if (userResults[0].password === hashPassword(password)) {
                                    const token = generateJWT({ 
                                        email: email, 
                                        level: 2, // Level 2 untuk user
                                        userid: userResults[0].id_user
                                    });

                                    // Send the JWT token in the Authorization header
                                    res.header('Authorization', `Bearer ${token}`);
                                    res.json({ success: true, level: 2, token: token, message: 'Login berhasil sebagai user' });
                                } else {
                                    res.json({ success: false, message: 'Email atau password anda salah!' });
                                }
                                connection.release();
                            } else {
                                // Jika tidak ada pengguna dengan email tersebut
                                res.json({ success: false, message: 'Email atau password anda salah!' });
                                connection.release();
                            }
                        });
                    }
                });
            });
        } else {
            res.json({ success: false, message: 'Masukkan email dan password!' });
        }
    },

    Logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
                return res.json({ success: false, message: 'Logout gagal' });
            }
            res.clearCookie('secretname');
            res.redirect('/login');
        });
    },

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    }
};
