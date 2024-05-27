const { hashPassword } = require('../utils/hashPassword');
const database = require('../initializers/database');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    Login(req, res) {
        let email = req.body.email;
        let password = req.body.pass;

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
                            req.session.loggedin = true;
                            req.session.level = 1; // Level 1 untuk admin
                            req.session.userid = adminResults[0].id_admin;
                            req.session.username = adminResults[0].username;

                            const token = jwt.sign({ 
                                email: email, 
                                level: req.session.level, 
                                userid: req.session.userid
                            }, process.env.JWT_SECRET, { expiresIn: '1h' });
                            
                            // Simpan token dalam sesi
                            req.session.token = token;
                            res.json({ success: true, level: req.session.level, token: req.session.token, message: 'Login berhasil sebagai user' });
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
                                    req.session.loggedin = true;
                                    req.session.level = 2; // Level 2 untuk user
                                    req.session.userid = userResults[0].id_user;
                                    req.session.username = userResults[0].username;

                                    const token = jwt.sign({ 
                                        email: email, 
                                        level: req.session.level, 
                                        userid: req.session.userid
                                    }, process.env.JWT_SECRET, { expiresIn: '1h' });
                                    
                                    // Simpan token dalam sesi
                                    req.session.token = token;

                                    res.json({ success: true, level: req.session.level, token: req.session.token, message: 'Login berhasil sebagai user' });

                                    return;
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
};
