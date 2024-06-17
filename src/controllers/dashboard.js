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
    getIkan(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_ikan`, function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        });
    },
    getIkanById(req, res){
        const userid = req.params.id;
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_ikan WHERE id_ikan=?`, [userid],
                function(error, result){
                    if(error) throw error;

                    res.send(result)
                }
            )
        })
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
    
            if (jenis_ikan){
                pool.getConnection(function(err, connection){
                    if (err) throw err;
                    connection.query(
                        `INSERT INTO tbl_ikan (jenis_ikan, foto_ikan) VALUES (?,?);`,
                        [jenis_ikan, req.file.path], function (error, result){
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
    
            if (jenis_ikan){
                pool.getConnection(function(err, connection){
                    if (err) throw err;
                    connection.query(
                        `UPDATE tbl_ikan SET jenis_ikan=?, foto_ikan=? WHERE id_ikan=?;`,
                        [jenis_ikan, req.file ? req.file.path : null, id_ikan], function (error, result){
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
    },
    createBenih(req, res){            
            let id_ikan = req.body.id_ikan;
            let ukuran = req.body.ukuran;
            let jumlah_ikan = req.body.jumlah_ikan;
            let harga_ikan = req.body.harga_ikan;

            if (id_ikan && ukuran && jumlah_ikan && harga_ikan){
                pool.getConnection(function(err, connection){
                    if (err) throw err;
                    connection.query(
                        `INSERT INTO tbl_benih (id_ikan, ukuran, jumlah_
                        ikan, harga_ikan) VALUES (?,?,?,?);`,
                        [id_ikan, ukuran, jumlah_ikan, harga_ikan], function (error, result){
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
        },
    editBenih(req, res) {
        let id_benih = req.body.id_benih;
        let id_ikan = req.body.id_ikan;
        let ukuran = req.body.ukuran;
        let jumlah_ikan = req.body.jumlah_ikan;
        let harga_ikan = req.body.harga_ikan;
    
        // Memastikan semua data yang diperlukan ada
        if (id_benih && id_ikan && ukuran && jumlah_ikan && harga_ikan) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    req.flash('color', 'danger');
                    req.flash('status', 'Oops..');
                    req.flash('message', 'Database connection failed');
                    res.redirect('/');
                    return;
                }
    
                connection.query(
                    `UPDATE tbl_benih 
                     SET id_ikan = ?, ukuran = ?, jumlah_ikan = ?, harga_ikan = ? 
                     WHERE id_benih = ?`,
                    [id_ikan, ukuran, jumlah_ikan, harga_ikan, id_benih],
                    function(error, result) {
                        connection.release();
                        if (error) {
                            console.error('Query error:', error);
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Update gagal');
                            res.redirect('/');
                            return;
                        }
    
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Update berhasil');
                        res.redirect('/');
                    }
                );
            });
        } else {
            req.flash('color', 'danger');
            req.flash('status', 'Oops..');
            req.flash('message', 'Data yang dimasukkan tidak lengkap!');
            res.redirect('/');
        }
    },
    deleteBenih(req, res) {
        let id_benih = req.params.id_benih; // Mengambil id_benih dari parameter URL
    
        if (id_benih) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    req.flash('color', 'danger');
                    req.flash('status', 'Oops..');
                    req.flash('message', 'Database connection failed');
                    res.redirect('/');
                    return;
                }
    
                connection.query(
                    `DELETE FROM tbl_benih WHERE id_benih = ?`,
                    [id_benih],
                    function(error, result) {
                        connection.release();
                        if (error) {
                            console.error('Query error:', error);
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Hapus data gagal');
                            res.redirect('/');
                            return;
                        }
    
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Hapus data berhasil');
                        res.redirect('/');
                    }
                );
            });
        } else {
            req.flash('color', 'danger');
            req.flash('status', 'Oops..');
            req.flash('message', 'ID benih tidak valid!');
            res.redirect('/');
        }
    },
    getBenih(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_benih`, function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        });
    },
    createKonsumsi(req, res) {            
        let id_ikan = req.body.id_ikan;
        let jumlah_ikan = req.body.jumlah_ikan;
        let harga_ikan = req.body.harga_ikan;
    
        if (id_ikan && jumlah_ikan && harga_ikan) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    req.flash('color', 'danger');
                    req.flash('status', 'Oops..');
                    req.flash('message', 'Database connection failed');
                    res.redirect('/');
                    return;
                }
    
                connection.query(
                    `INSERT INTO tbl_konsumsi (id_ikan, jumlah_ikan, harga_ikan) VALUES (?,?,?);`,
                    [id_ikan, jumlah_ikan, harga_ikan],
                    function (error, result) {
                        connection.release();
                        if (error) {
                            console.error('Query error:', error);
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Input gagal');
                            res.redirect('/');
                            return;
                        }
    
                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Input berhasil');
                        res.redirect('/');
                    }
                );
            });
        } else {
            req.flash('color', 'danger');
            req.flash('status', 'Oops..');
            req.flash('message', 'Data yang dimasukkan tidak lengkap!');
            res.redirect('/');
        }
    },
    editKonsumsi(req, res) {
    let id_konsumsi = req.body.id_konsumsi;
    let id_ikan = req.body.id_ikan;
    let jumlah_ikan = req.body.jumlah_ikan;
    let harga_ikan = req.body.harga_ikan;

    if (id_konsumsi && id_ikan && jumlah_ikan && harga_ikan) {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', 'Database connection failed');
                res.redirect('/');
                return;
            }

            connection.query(
                `UPDATE tbl_konsumsi 
                 SET id_ikan = ?, jumlah_ikan = ?, harga_ikan = ? 
                 WHERE id_konsumsi = ?`,
                [id_ikan, jumlah_ikan, harga_ikan, id_konsumsi],
                function(error, result) {
                    connection.release();
                    if (error) {
                        console.error('Query error:', error);
                        req.flash('color', 'danger');
                        req.flash('status', 'Oops..');
                        req.flash('message', 'Update gagal');
                        res.redirect('/');
                        return;
                    }

                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'Update berhasil');
                    res.redirect('/');
                }
            );
        });
    } else {
        req.flash('color', 'danger');
        req.flash('status', 'Oops..');
        req.flash('message', 'Data yang dimasukkan tidak lengkap!');
        res.redirect('/');
        }
    },
    deleteKonsumsi(req, res) {
        let id_konsumsi = req.params.id_konsumsi; // Mengambil id_konsumsi dari parameter URL

        if (id_konsumsi) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    req.flash('color', 'danger');
                    req.flash('status', 'Oops..');
                    req.flash('message', 'Database connection failed');
                    res.redirect('/');
                    return;
                }

                connection.query(
                    `DELETE FROM tbl_konsumsi WHERE id_konsumsi = ?`,
                    [id_konsumsi],
                    function(error, result) {
                        connection.release();
                        if (error) {
                            console.error('Query error:', error);
                            req.flash('color', 'danger');
                            req.flash('status', 'Oops..');
                            req.flash('message', 'Hapus data gagal');
                            res.redirect('/');
                            return;
                        }

                        req.flash('color', 'success');
                        req.flash('status', 'Yes..');
                        req.flash('message', 'Hapus data berhasil');
                        res.redirect('/');
                    }
                );
            });
        } else {
            req.flash('color', 'danger');
            req.flash('status', 'Oops..');
            req.flash('message', 'ID konsumsi tidak valid!');
            res.redirect('/');
        }
    },
    getKonsumsi(req, res){
        pool.getConnection(function(err, connection){
            if (err) throw error;
            connection.query(
                `SELECT * FROM tbl_konsumsi`, function(error, result){
                    if (error) throw error;

                    res.send(result)
                }
            )
        });
    },
    getTotalIkan(req, res) {
        pool.getConnection(function(err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                res.status(500).json({ success: false, message: 'Database connection failed' });
                return;
            }
    
            // Query untuk mendapatkan total ikan dari tbl_benih
            let queryBenih = `SELECT IFNULL(SUM(jumlah_ikan), 0) as total_benih FROM tbl_benih`;
    
            // Query untuk mendapatkan total ikan dari tbl_konsumsi
            let queryKonsumsi = `SELECT IFNULL(SUM(jumlah_ikan), 0) as total_konsumsi FROM tbl_konsumsi`;
    
            // Eksekusi query untuk tbl_benih
            connection.query(queryBenih, function(errorBenih, resultBenih) {
                if (errorBenih) {
                    connection.release();
                    console.error('Query error (tbl_benih):', errorBenih);
                    res.status(500).json({ success: false, message: 'Query failed for tbl_benih' });
                    return;
                }
    
                // Eksekusi query untuk tbl_konsumsi
                connection.query(queryKonsumsi, function(errorKonsumsi, resultKonsumsi) {
                    connection.release();
                    if (errorKonsumsi) {
                        console.error('Query error (tbl_konsumsi):', errorKonsumsi);
                        res.status(500).json({ success: false, message: 'Query failed for tbl_konsumsi' });
                        return;
                    }
    
                    // Mendapatkan hasil total dari kedua tabel
                    let totalBenih = resultBenih[0].total_benih;
                    let totalKonsumsi = resultKonsumsi[0].total_konsumsi;
    
                    // Menghitung jumlah total dari keduanya
                    let totalIkan = totalBenih + totalKonsumsi;
    
                    // Mengirimkan hasil sebagai JSON
                    res.json({
                        success: true,
                        total_ikan: totalIkan,
                        detail: {
                            total_benih: totalBenih,
                            total_konsumsi: totalKonsumsi
                        }
                    });
                });
            });
        });
    }
    };
