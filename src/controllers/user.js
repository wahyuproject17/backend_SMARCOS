const database = require('../initializers/database');

let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    getUser(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_user`, function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        });
    },
    getUserById(req, res){
        const userid = req.params.id;
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_user WHERE id_user=?`, [userid],
                function(error, result){
                    if(error) throw error;

                    res.send(result)
                }
            )
        })
    },
    createUser(req,res){
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
    },
    updateUser(req, res){
        let userid = req.params.id;
        let username = req.body.username;
        let nama_lengkap = req.body.namalengkap;
        let no_hp = req.body.nohp;
        let email = req.body.email;
        let alamat = req.body.alamat;
        let password = req.body.pass;

        if(username && nama_lengkap && no_hp && email && alamat && password){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `UPDATE tbl_user SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?, alamat = ?, password = SHA2(?, 512) WHERE id_user = ?;`,
                    [username, nama_lengkap, no_hp, email, alamat, password, userid], function(error, result){
                        if(error) throw error;
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Ubah data berhasil');

                        res.redirect('/');
                    }
                )
            })
        }else {
            req.flash('color', 'danger');
            req.flash('status', 'gagal');
            req.flash('message', 'Username atau No Hp atau Email sudah digunakan');
            
            res.redirect('/');
            res.end();
        }
    },
    deleteUser(req, res){
        let userid = req.params.id;

        if(userid){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `DELETE FROM tbl_user WHERE id_user = ?`, [userid],
                    function(error, result){
                        if(error) throw error;
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Penghapusan berhasil');

                        res.redirect('/');
                    }
                )
            })
        }
    }
}