const database = require('../initializers/database');
const path = require('path');
const multer = require('multer');
let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

// Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Ekspor middleware untuk upload gambar
module.exports.uploadImage = upload.single('foto'); // 'foto' adalah nama field file pada form data

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
        const { jenis_ikan } = req.body;
        const foto_ikan = req.file ? req.file.path : null;

        if (jenis_ikan && foto_ikan) {
            pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `INSERT INTO tbl_ikan (jenis_ikan, foto_ikan) VALUES (?, ?)`,
                [jenis_ikan, foto_ikan],
                function (error, results) {
                if (error) throw error;
                res.send({ message: 'Fish added successfully', id: results.insertId });
                }
            );
            connection.release();
            });
        } else {
            res.status(400).send({ message: 'All fields are required' });
        }
            },
        editIkan(req, res){
        const fishId = req.params.id;
        const { jenis_ikan } = req.body;
        const foto_ikan = req.file ? req.file.path : null;

        if (jenis_ikan) {
            pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `UPDATE tbl_ikan SET jenis_ikan = ?, foto_ikan = COALESCE(?, foto_ikan) WHERE id_ikan = ?`,
                [jenis_ikan, foto_ikan, fishId],
                function (error, results) {
                if (error) throw error;
                res.send({ message: 'Fish data updated successfully' });
                }
            );
            connection.release();
            });
        } else {
            res.status(400).send({ message: 'All fields are required' });
        }
    },
    deleteIkan(req, res){
        const fishId = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(`DELETE FROM tbl_ikan WHERE id_ikan = ?`, [fishId], function (error, results) {
            if (error) throw error;
            res.send({ message: 'Fish data deleted successfully' });
            });
            connection.release();
        });
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
                    });
                  
                    connection.release();
                })
            } else {
                req.flash('color', 'danger');
                req.flash('status', 'Oops..');
                req.flash('message', 'Data yang dimasukkan tidak lengkap!');
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
    getAllIkan(req, res) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            
            // Query untuk tbl_benih
            connection.query(`SELECT tbl_ikan.*, tbl_benih.* FROM tbl_ikan INNER JOIN tbl_benih ON tbl_ikan.id_ikan = tbl_benih.id_ikan;`, function(error_benih, result_benih) {
                if (error_benih) throw error_benih;
    
                // Query untuk tbl_konsumsi
                connection.query(`SELECT tbl_ikan.*, tbl_konsumsi.* FROM tbl_ikan INNER JOIN tbl_konsumsi ON tbl_ikan.id_ikan = tbl_konsumsi.id_ikan;`, function(error_konsumsi, result_konsumsi) {
                    if (error_konsumsi) throw error_konsumsi;
    
                    // Gabungkan hasil dari kedua query
                    res.send({
                        benih: result_benih,
                        konsumsi: result_konsumsi
                    });
                });
            });
            
            // Lepaskan koneksi setelah selesai
            connection.release();
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
