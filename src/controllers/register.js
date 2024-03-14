const database = require('../initializers/database');

let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    saveRegister(req,res){
        let nama_lengkap = req.body.namalengkap;
        let no_hp = '62'+req.body.nohp;
        let email = req.body.email;
        let alamat = req.body.alamat;
        let password = req.body.pass;

        if (nama_lengkap && no_hp && email && alamat && password) {
    
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `INSERT INTO user_register (nama_lengkap, no_hp, email, alamat, password) VALUES (?,?,?,?,SHA2(?,512));`
                , [nama_lengkap, no_hp, email, alamat, password],function (error, results) {
                    if (error) throw error;
              
                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'Registrasi berhasil');
                    
                    res.redirect('/login');
                });
              
                connection.release();
            })
        } else {
            
            res.redirect('/login');
            res.end();
        }
    }
}