const database = require('../initializers/database');

let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    Dashboard(req, res){
        let data_ph = req.body.phair;
        let data_suhu = req.body.suhuair;
    },
    createIkan(req, res){
        let jenis_ikan = req.body.jenisikan;
        let jumlah_ikan = req.body.jumlah;
        let harga_ikan = req.body.harga;

        if (jenis_ikan && stok_ikan){
            pool.getConnection(function(err, connection){
                if (err) throw err;
                connection.query(
                    `INSERT INTO tbl_ikan (jenis_ikan, jumlah_ikan, harga_ikan) VALUES (?,?,?);`,
                    [jenis_ikan, jumlah_ikan, harga_ikan], function (error, res){
                        if (error) throw error;
              
                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'Input berhasil');
                    
                    res.redirect('/AddIkan');
                });
              
                connection.release();
                    
                })
            }else {
            
                res.redirect('/inputIkan');
                res.end();
            }
        }
    }
