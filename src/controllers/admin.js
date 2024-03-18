const database = require('../initializers/database');

let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    getAdmin(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_admin`, function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        });
    },
    getAdminById(req, res){
        const userid = req.params.id;
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_admin WHERE id_admin=?`, [userid],
                function(error, result){
                    if(error) throw error;

                    res.send(result)
                }
            )
        })
    },
    createAdmin(req,res){
        let username = req.body.username;
        let nama_lengkap = req.body.namalengkap;
        let no_hp = req.body.nohp;
        let email = req.body.email;
        let password = req.body.pass;

        if (username && nama_lengkap && no_hp && email && password) {
    
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `INSERT INTO tbl_admin (username, nama_lengkap, no_hp, email, password) VALUES (?,?,?,?,SHA2(?,512));`
                , [username, nama_lengkap, no_hp, email, password],function (error, results) {
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
    updateAdmin(req, res){
        let userid = req.params.id;
        let username = req.body.username;
        let nama_lengkap = req.body.namalengkap;
        let no_hp = req.body.nohp;
        let password = req.body.pass;

        if(username && nama_lengkap && no_hp && email && password){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `UPDATE tbl_admin SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?, password = SHA2(?, 512) WHERE id_admin = ?;`,
                    [username, nama_lengkap, no_hp, email, password, userid], function(error, result){
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
    deleteAdmin(req, res){
        let userid = req.params.id;

        if(userid){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `DELETE FROM tbl_admin WHERE id_admin = ?`, [userid],
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