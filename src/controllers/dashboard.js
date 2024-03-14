const database = require('../initializers/database');

let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    dashboard(req, res){
        let data_ph = req.body.phair;
        let data_suhu = req.body.suhuair;
    },
    inputIkan(req, res){
        let jenis_ikan = req.body.jenisikan;
        let stok_ikan = req.body.stokikan;

        if (jenis_ikan && stok_ikan){
            pool.getConnection(function(err, connection){
                if (err) throw err;
                connection.query(
                    `INSERT INTO data_ikan (jenisikan, stokikan) VALUES (?,?);`,
                    [jenis_ikan, stok_ikan], function (error, res){
                        if (error) throw error;
              
                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'Input berhasil');
                    
                    res.redirect('/inputIkan');
                });
              
                connection.release();
                    
                })
            }else {
            
                res.redirect('/stokIkan');
                res.end();
            }
        }
    }
