const database = require('../initializers/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(database);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    addTulisan(req, res){
        let ucapan = req.body.ucapan;
        let alamat = req.body.alamat;
        let telepon = req.body.telepon;
        let instagram = req.body.instagram;
        let email = req.body.email;

        if(ucapan && alamat && telepon && instagram && email){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `INSERT INTO tbl_tulisan(ucapan, alamat, telepon, instagram, email) VALUES (?,?,?,?,?); `,
                    [ucapan, alamat, telepon, instagram, email], function (error, results){
                        if (error) throw error;
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Penambahan berhasil');
                    
                        res.redirect('/');
                    }
                )
            })
        }
    },
    editTulisan(req, res){
        let id = req.params.id;
        let ucapan = req.body.ucapan;
        let alamat = req.body.alamat;
        let telepon = req.body.telepon;
        let instagram = req.body.instagram;
        let email = req.body.email;

        if (ucapan && alamat && telepon && instagram && email && id) {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `UPDATE tbl_tulisan SET ucapan=?, alamat=?, telepon=?, instagram=?, email=? WHERE id_tulisan=?;`,
                    [ucapan, alamat, telepon, instagram, email, id],
                    function(error, results) {
                        if (error) throw error;
                    }
                )
            })
        }
    },
    showTulisan(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_tulisan`,
                function(error, results){
                    if (error) throw error;
                    res.send(results);
                }
            )
        })
    }
}