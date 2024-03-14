const response = require('./response');
const database = require('../initializers/database');

let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    AddUser(req,res){
        let username = req.body.username;
        let nama_lengkap = req.body.namalengkap;
        let no_hp = req.body.nohp;
        let email = req.body.email;
        let alamat = req.body.alamat;
        let password = req.body.pass;

        if (username && nama_lengkap && no_hp && email && alamat && password) {
    
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `INSERT INTO tbl_user (username, nama_lengkap, no_hp, email, alamat, password) VALUES (?,?,?,?,?,SHA2(?,512));`
                , [username, nama_lengkap, no_hp, email, alamat, password],function (error, results) {
                    if (error) throw error;
              
                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'Registrasi berhasil');
                    
                    response();
                    res.redirect('/login');
                });
              
                connection.release();
            })
        } else {
            req.flash('color', 'danger');
            req.flash('status', 'gagal');
            req.flash('message', 'Username atau No Hp atau Email sudah digunakan');
            
            res.redirect('/login');
            res.end();
        }
    }
}