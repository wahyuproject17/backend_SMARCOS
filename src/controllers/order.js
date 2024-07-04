const database = require('../initializers/database');
const mysql = require('mysql');
const pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    createOrder(req, res) {
        let id_user = req.userId;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let hargasatuan = req.body.hargaikan;
        let harga = jumlahikan * hargasatuan;
        let ukuran = req.body.ukuran;
        let kategori = req.body.kategori; // Tambahkan kategori: 'benih' atau 'konsumsi'
    
        if (id_user && jenisikan && jumlahikan && harga && kategori) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    res.status(500).json({ success: false, message: 'Database connection failed' });
                    return;
                }
    
                connection.beginTransaction(function (err) {
                    if (err) {
                        connection.release();
                        console.error('Transaction error:', err);
                        res.status(500).json({ success: false, message: 'Transaction failed' });
                        return;
                    }
    
                    // Insert into tbl_pesanan
                    connection.query(
                        `INSERT INTO tbl_pesanan(id_user, jenis_ikan, jumlah_ikan, ukuran, harga, kategori) VALUES (?, ?, ?, ?, ?, ?);`,
                        [id_user, jenisikan, jumlahikan, ukuran, harga, kategori],
                        function (error, results) {
                            if (error) {
                                return connection.rollback(function () {
                                    connection.release();
                                    console.error('Insert error:', error);
                                    res.status(500).json({ success: false, message: 'Insert failed' });
                                });
                            }
    
                            // Pilih tabel berdasarkan kategori
                            let updateTable = kategori === 'Benih' ? 'tbl_benih' : 'tbl_konsumsi';
    
                            // Update jumlah ikan in the selected table
                            connection.query(
                                `UPDATE ${updateTable} JOIN tbl_ikan i ON ${updateTable}.id_ikan = i.id_ikan SET ${updateTable}.jumlah_ikan = ${updateTable}.jumlah_ikan - ? WHERE i.jenis_ikan = ?;`,
                                [jumlahikan, jenisikan],
                                function (error, result) {
                                    if (error) {
                                        return connection.rollback(function () {
                                            connection.release();
                                            console.error('Update error:', error);
                                            res.status(500).json({ success: false, message: 'Update failed' });
                                        });
                                    }
    
                                    connection.commit(function (err) {
                                        if (err) {
                                            return connection.rollback(function () {
                                                connection.release();
                                                console.error('Commit error:', err);
                                                res.status(500).json({ success: false, message: 'Commit failed' });
                                            });
                                        }
    
                                        console.log('Order created successfully and fish quantity updated');
                                        res.status(200).json({ success: true, message: 'Pesanan berhasil ditambahkan dan jumlah ikan berhasil diperbarui' });
                                        connection.release();
                                    });
                                }
                            );
                        }
                    );
                });
            });
        } else {
            console.log('Incomplete data');
            res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }
    },
    getOrder(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                res.status(500).json({ success: false, message: 'Database connection failed' });
                return;
            }
            connection.query(
                `SELECT * FROM tbl_pesanan, tbl_user WHERE tbl_pesanan.id_user = tbl_user.id_user ORDER BY pesanan_tanggal DESC`, 
                function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Query error:', error);
                        res.status(500).json({ success: false, message: 'Query failed' });
                        return;
                    }
                    res.send(result);
                }
            );
        });
    },
    getOrderById(req, res) {
        let id = req.params.idpesanan;
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                res.status(500).json({ success: false, message: 'Database connection failed' });
                return;
            }
            connection.query(
                `SELECT * FROM tbl_pesanan, tbl_user WHERE tbl_pesanan.id_user = tbl_user.id_user AND id_pesanan = ?`, 
                [id], 
                function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Query error:', error);
                        res.status(500).json({ success: false, message: 'Query failed' });
                        return;
                    }
                    res.send(result);
                }
            );
        });
    },
    updateOrder(req, res) {
        let id_order = req.params.idpesanan;
        let id_user = req.session.userid;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let hargasatuan = req.body.hargaikan;
        let harga = jumlahikan * hargasatuan;

        if (id_user && jenisikan && jumlahikan && harga) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    res.status(500).json({ success: false, message: 'Database connection failed' });
                    return;
                }
                connection.query(
                    `UPDATE tbl_pesanan SET jumlah_ikan = ?, harga = ? WHERE id_pesanan = ?;`,
                    [jumlahikan, harga, id_order], 
                    function (error, result) {
                        connection.release();
                        if (error) {
                            console.error('Update error:', error);
                            res.status(500).json({ success: false, message: 'Update failed' });
                            return;
                        }
                        res.status(200).json({ success: true, message: 'Ubah pesanan berhasil' });
                    }
                );
            });
        } else {
            console.log('Incomplete data');
            res.status(400).json({ success: false, message: 'Mohon cek kembali data yang anda masukkan' });
        }
    },
    deleteOrder(req, res) {
        let idorder = req.params.idpesanan;

        if (idorder) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    res.status(500).json({ success: false, message: 'Database connection failed' });
                    return;
                }
                connection.query(
                    `DELETE FROM tbl_pesanan WHERE id_pesanan = ?`, [idorder],
                    function (error, result) {
                        connection.release();
                        if (error) {
                            console.error('Delete error:', error);
                            res.status(500).json({ success: false, message: 'Delete failed' });
                            return;
                        }
                        res.status(200).json({ success: true, message: 'Penghapusan berhasil' });
                    }
                );
            });
        } else {
            console.log('Order ID is required');
            res.status(400).json({ success: false, message: 'Order ID is required' });
        }
    },
    getTotalOrder(req, res) {
        let year = req.params.year; // Mengambil parameter tahun dari URL
        if (!year) {
            year = new Date().getFullYear(); // Jika tidak ada tahun yang disediakan, gunakan tahun saat ini
        }
        
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                res.status(500).json({ success: false, message: 'Database connection failed' });
                return;
            }
    
            // Menghitung jumlah pesanan dalam satu tahun
            connection.query(
                `SELECT COUNT(*) as total_orders FROM tbl_pesanan WHERE YEAR(pesanan_tanggal) = ?`,
                [year],
                function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Query error:', error);
                        res.status(500).json({ success: false, message: 'Query failed' });
                        return;
                    }
    
                    // Mengembalikan jumlah total pesanan
                    res.json({ success: true, total_orders: result[0].total_orders });
                }
            );
        });
    }
};
