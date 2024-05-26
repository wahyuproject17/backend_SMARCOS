const {hashPassword} = require('../utils/hashPassword');
const database = require('../initializers/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={

    Login(req, res) {
        let email = req.body.email;
        let password = req.body.pass;
    
        if (email && password) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                // Cek apakah pengguna adalah admin
                connection.query(
                    `SELECT * FROM tbl_admin WHERE email = ?`, [email], function (error, adminResults) {
                        if (error) throw error;
    
                        if (adminResults.length == !null) {
                            if (adminResults[0].password === hashPassword(password)) {
                                req.session.loggedin = true;
                                req.session.level = 1; // Level 1 untuk admin
                                req.session.userid = adminResults[0].id_admin;
                                req.session.username = adminResults[0].username;
                                res.json({ success: true, message: 'Login berhasil sebagai admin' });
                                connection.release();
                                return; // Keluar dari fungsi setelah login berhasil
                            } else {
                                res.json({ success: false, message: 'Email atau password anda salah!' });
                                connection.release();
                                return; // Keluar dari fungsi setelah login gagal
                            }
                        } else {
                            // Cek apakah pengguna adalah user
                            connection.query(
                                `SELECT * FROM tbl_user WHERE email = ?`, [email], function (error, userResults) {
                                    if (error) throw error;
    
                                    if (userResults.length > 0) {
                                        if (userResults[0].password === hashPassword(password)) {
                                            req.session.loggedin = true;
                                            req.session.level = 2; // Level 2 untuk user
                                            req.session.userid = userResults[0].id_user;
                                            req.session.username = userResults[0].username;
                                            res.json({ success: true, message: 'Login berhasil sebagai user' });
                                            connection.release();
                                            return; // Keluar dari fungsi setelah login berhasil
                                        } else {
                                            res.json({ success: false, message: 'Email atau password anda salah!' });
                                            connection.release();
                                            return; // Keluar dari fungsi setelah login gagal
                                        }
                                    } else {
                                        // Jika tidak ada pengguna dengan email tersebut
                                        res.json({ success: false, message: 'Email atau password anda salah!' });
                                        connection.release();
                                        return; // Keluar dari fungsi setelah login gagal
                                    }
                                }
                            );
                        }
                    }
                );
            });
        } else {
            res.json({ success: false, message: 'Masukkan email dan password!' });
        }
    }    
,
    Logout(req,res){
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            // Hapus cokie yang masih tertinggal
            res.clearCookie('secretname');
            res.redirect('/login');
        });
    },
}