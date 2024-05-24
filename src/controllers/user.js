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
    createUser(req, res) {
        let username = req.body.username;
        let nama_lengkap = req.body.namalengkap;
        let no_hp = req.body.nohp;
        let email = req.body.email;
        let jenkel = req.body.jenkel;
        let alamat = req.body.alamat;
        let password = req.body.pass;
    
        console.log("Request Data: ", req.body); // Log data yang diterima
    
        if (username && nama_lengkap && no_hp && email && alamat && password) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    res.status(500).json({ success: false, message: 'Database connection failed' });
                    return;
                }
    
                connection.query(
                    `INSERT INTO tbl_user (username, nama_lengkap, no_hp, email, jenkel, alamat, password) VALUES (?,?,?,?,?,?,SHA2(?,512));`,
                    [username, nama_lengkap, no_hp, email, jenkel, alamat, password],
                    function (error, results) {
                        connection.release();
    
                        if (error) {
                            console.error('Error inserting data:', error);
                            res.status(500).json({ success: false, message: 'Error inserting data' });
                            return;
                        }
    
                        console.log('User registered successfully');
                        res.status(200).json({ success: true, message: 'Registrasi berhasil' });
                    }
                );
            });
        } else {
            console.log('Missing required fields');
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },
    updateUser(req, res){
        let userid = req.params.id;
        let username = req.body.username;
        let nama_lengkap = req.body.namalengkap;
        let no_hp = req.body.nohp;
        let email = req.body.email;
        let jenkel = req.body.jenkel;
        let alamat = req.body.alamat;
        let password = req.body.pass;

        if(username && nama_lengkap && no_hp && email && alamat && password){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `UPDATE tbl_user SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?, jenkel = ?, alamat = ?, password = SHA2(?, 512) WHERE id_user = ?;`,
                    [username, nama_lengkap, no_hp, email, jenkel, alamat, password, userid], function(error, result){
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