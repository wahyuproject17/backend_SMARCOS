const database = require('../initializers/database');
const uploadDeleteOld = require('../middleware/multer');

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
    createIkan(req, res, next){
        uploadDeleteOld(req, res, function (err) {
            if (err) {
                // Jika terjadi kesalahan saat upload file
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', err.message || 'Terjadi kesalahan saat mengunggah file.');
                return res.redirect('/');
            }
            
            let jenis_ikan = req.body.jenisikan;
            let jumlah_ikan = req.body.jumlah;
            let harga_ikan = req.body.harga;
    
            if (jenis_ikan && jumlah_ikan && harga_ikan){
                pool.getConnection(function(err, connection){
                    if (err) throw err;
                    connection.query(
                        `INSERT INTO tbl_ikan (jenis_ikan, jumlah_ikan, harga_ikan, foto_ikan) VALUES (?,?,?,?);`,
                        [jenis_ikan, jumlah_ikan, harga_ikan, req.file.path], function (error, result){
                            if (error) throw error;
                  
                            req.flash('color', 'success');
                            req.flash('status', 'Yes..');
                            req.flash('message', 'Input berhasil');
                        
                            res.redirect('/');
                    });
                  
                    connection.release();
                })
            } else {
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', 'Data yang dimasukkan tidak lengkap!');
                res.redirect('/');
            }
        });
    },
    editIkan(req, res){
        uploadDeleteOld(req, res, function (err) {
            if (err) {
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', err.message || 'Terjadi kesalahan saat mengunggah file.');
                return res.redirect('/' + req.params.id);
            }
    
            let id_ikan = req.params.id;
            let jenis_ikan = req.body.jenisikan;
            let jumlah_ikan = req.body.jumlah;
            let harga_ikan = req.body.harga;
    
            if (jenis_ikan && jumlah_ikan && harga_ikan){
                pool.getConnection(function(err, connection){
                    if (err) throw err;
                    connection.query(
                        `UPDATE tbl_ikan SET jenis_ikan=?, jumlah_ikan=?, harga_ikan=?, foto_ikan=? WHERE id_ikan=?;`,
                        [jenis_ikan, jumlah_ikan, harga_ikan, req.file ? req.file.path : null, id_ikan], function (error, result){
                            if (error) throw error;
                  
                            req.flash('color', 'success');
                            req.flash('status', 'Yes..');
                            req.flash('message', 'Data ikan berhasil diperbarui');
                        
                            res.redirect('/');
                    });
                  
                    connection.release();
                })
            } else {
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', 'Data yang dimasukkan tidak lengkap!');
                res.redirect('/editIkan/' + id);
            }
        });
    },
    deleteIkan(req, res){
        let id_ikan = req.params.id;
        if(id_ikan){
            pool.getConnection(function(err, connection){
                if (err) throw error;
                connection.query(
                    `DELETE FROM tbl_ikan WHERE id_ikan = ?`, [id_ikan],
                    function(error, result){
                        if (error) throw error;
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
