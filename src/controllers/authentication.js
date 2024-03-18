const {hashPassword} = require('../utils/hashPassword');
const database = require('../initializers/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    Login(req,res){
        let email = req.body.email;
        let password = req.body.pass;
        if (email && password) {
            let hashedPassword = hashPassword(password);
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `SELECT * FROM tbl_admin WHERE email = ? AND password = ?`,
                     [email, hashedPassword], function (error, results) {
                    if (error) throw error;
                    if (!results.length == 0) {
                        req.session.loggedin = true;
                        req.session.level = 1;
                        req.session.userid = results[0].id_user;
                        req.session.username = results[0].username;
                        res.redirect('/');
                    } else {
                        connection.query(
                            `SELECT * FROM tbl_user WHERE email = ? AND password = ?`,
                             [email, hashedPassword], function(error, results){
                                if(error) throw error;
                                if (!results.length == 0){
                                    req.session.loggedin = true;
                                    req.session.level = 2;
                                    req.session.userid = results[0].id_admin;
                                    req.session.username = results[0].username;
                                    res.redirect('/');
                                }
                                else{
                                    req.flash('color', 'danger');
                                    req.flash('status', 'Oops..');
                                    req.flash('message', 'Email atau password anda salah!');
                                    res.redirect('/login');
                                }
                             }
                        )
                    }
                });
                connection.release();
            })
        } else {
            res.redirect('/login');
        }
    },
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