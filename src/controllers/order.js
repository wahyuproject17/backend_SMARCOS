const pool = require('../initializers/database');
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = {
    async createOrder(req, res) {
        let id_user = req.userId;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let harga = req.body.hargaikan;
        let ukuran = req.body.ukuran;
        let kategori = req.body.kategori;
        let status = "menunggu";
    
        if (id_user && jenisikan && jumlahikan && harga && kategori) {
            let connection;
            try {
                connection = await pool.getConnection();
                await connection.beginTransaction();
    
                // Insert into tbl_pesanan
                await connection.query(
                    `INSERT INTO tbl_pesanan(id_user, jenis_ikan, jumlah_ikan, ukuran, harga, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                    [id_user, jenisikan, jumlahikan, ukuran, harga, kategori, status]
                );
    
                await connection.commit();
                res.status(200).json({ success: true, message: 'Pesanan berhasil ditambahkan' });
            } catch (err) {
                if (connection) {
                    await connection.rollback();
                }
                console.error('Transaction error:', err);
                res.status(500).json({ success: false, message: 'Transaction failed' });
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        } else {
            res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }
    },

    async getOrder(req, res) {
        try {
            const [result] = await pool.query(
                `SELECT * FROM tbl_pesanan JOIN tbl_user ON tbl_pesanan.id_user = tbl_user.id_user ORDER BY pesanan_tanggal DESC`
            );
            res.send(result);
        } catch (err) {
            console.error('Database query error:', err);
            res.status(500).json({ success: false, message: 'Query failed' });
        }
    },
    async getTingkatKepuasan(req, res) {
        try {
            const [result] = await pool.query(`
                SELECT tingkat_kepuasan, COUNT(*) AS jumlah 
                FROM tbl_pesanan 
                GROUP BY tingkat_kepuasan
            `);
    
            // Format data menjadi object dengan kategori lengkap
            const response = {
                kurang_puas: 0,
                cukup_puas: 0,
                puas: 0,
                sangat_puas: 0
            };
    
            result.forEach(row => {
                if (row.tingkat_kepuasan === 'kurang puas') {
                    response.kurang_puas = row.jumlah;
                } else if (row.tingkat_kepuasan === 'cukup puas') {
                    response.cukup_puas = row.jumlah;
                } else if (row.tingkat_kepuasan === 'puas') {
                    response.puas = row.jumlah;
                } else if (row.tingkat_kepuasan === 'sangat puas') {
                    response.sangat_puas = row.jumlah;
                }
            });
    
            res.json(response);
        } catch (err) {
            console.error('Database query error:', err);
            res.status(500).json({ success: false, message: 'Query failed' });
        }
    },    

    async getOrderById(req, res) {
        let id = req.params.id;
        try {
            const [result] = await pool.query(
                `SELECT id_pesanan, jenis_ikan, jumlah_ikan, ukuran, harga, status, tingkat_kepuasan, pesanan_tanggal FROM tbl_pesanan WHERE id_user = ?`, 
                [id]
            );
            res.send(result);
        } catch (err) {
            console.error('Database query error:', err);
            res.status(500).json({ success: false, message: 'Query failed' });
        }
    },

    async updateOrder(req, res) {
        let id_order = req.params.idpesanan;
        let id_user = req.session.userid;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let hargasatuan = req.body.hargaikan;
        let harga = jumlahikan * hargasatuan;
        let status = req.body.status; // Tambahkan status dalam body request
    
        if (id_user && jenisikan && jumlahikan && harga && status) {
            let connection;
            try {
                connection = await pool.getConnection();
                await connection.beginTransaction();
    
                // Update order
                await connection.query(
                    `UPDATE tbl_pesanan SET jumlah_ikan = ?, harga = ?, status = ? WHERE id_pesanan = ?;`,
                    [jumlahikan, harga, status, id_order]
                );
    
                // Jika status berubah menjadi selesai, kurangi jumlah ikan
                if (status === "selesai") {
                    // Pilih tabel berdasarkan kategori
                    const [orderData] = await connection.query(
                        `SELECT kategori, ukuran FROM tbl_pesanan WHERE id_pesanan = ?;`,
                        [id_order]
                    );
    
                    const kategori = orderData[0].kategori;
                    const ukuran = orderData[0].ukuran;
                    const updateTable = kategori === 'Benih' ? 'tbl_benih' : 'tbl_konsumsi';
    
                    // Kurangi jumlah ikan di stok
                    await connection.query(
                        `UPDATE ${updateTable} JOIN tbl_ikan i ON ${updateTable}.id_ikan = i.id_ikan 
                        SET ${updateTable}.jumlah_ikan = ${updateTable}.jumlah_ikan - ? 
                        WHERE i.jenis_ikan = ? AND ukuran = ?;`,
                        [jumlahikan, jenisikan, ukuran]
                    );
                }
    
                await connection.commit();
                res.status(200).json({ success: true, message: 'Pesanan berhasil diperbarui' });
            } catch (err) {
                if (connection) {
                    await connection.rollback();
                }
                console.error('Update error:', err);
                res.status(500).json({ success: false, message: 'Update failed' });
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        } else {
            res.status(400).json({ success: false, message: 'Mohon cek kembali data yang anda masukkan' });
        }
    },

    async updateOrderStatus(req, res) {
        const id_order = req.params.id;
        const { status } = req.body; // Status baru dari request body
    
        if (!id_order || !status) {
            return res.status(400).json({ success: false, message: 'ID pesanan dan status wajib diisi' });
        }
    
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
    
            // Perbarui status pesanan
            const [result] = await connection.query(
                `UPDATE tbl_pesanan SET status = ? WHERE id_pesanan = ?;`,
                [status, id_order]
            );
    
            if (result.affectedRows === 0) {
                throw new Error('Pesanan tidak ditemukan');
            }
    
            // Ambil data pesanan untuk stok
            const [orderData] = await connection.query(
                `SELECT kategori, ukuran, jumlah_ikan, jenis_ikan FROM tbl_pesanan WHERE id_pesanan = ?;`,
                [id_order]
            );
    
            if (!orderData.length) {
                throw new Error('Data pesanan tidak ditemukan');
            }
    
            const { kategori, ukuran, jumlah_ikan, jenis_ikan } = orderData[0];
            const updateTable = kategori === 'Benih' ? 'tbl_benih' : 'tbl_konsumsi';
    
            // Kurangi jumlah ikan di stok
            if (kategori === 'Benih') {
                // Untuk tbl_benih (dengan ukuran)
                await connection.query(
                    `UPDATE ${updateTable} JOIN tbl_ikan i ON ${updateTable}.id_ikan = i.id_ikan 
                    SET ${updateTable}.jumlah_ikan = ${updateTable}.jumlah_ikan - ? 
                    WHERE i.jenis_ikan = ? AND ${updateTable}.ukuran = ?;`,
                    [jumlah_ikan, jenis_ikan, ukuran]
                );
            } else if (kategori === 'Konsumsi') {
                // Untuk tbl_konsumsi (tanpa ukuran)
                await connection.query(
                    `UPDATE ${updateTable} JOIN tbl_ikan i ON ${updateTable}.id_ikan = i.id_ikan 
                    SET ${updateTable}.jumlah_ikan = ${updateTable}.jumlah_ikan - ? 
                    WHERE i.jenis_ikan = ?;`,
                    [jumlah_ikan, jenis_ikan]
                );
            }
    
            await connection.commit();
            res.status(200).json({ success: true, message: 'Status pesanan dan stok berhasil diperbarui' });
        } catch (err) {
            if (connection) {
                await connection.rollback();
            }
            console.error('Error updating order status:', err);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui status pesanan' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    }, 
    async updateOrderRating(req, res) {
        const id_order = req.params.id;
        const { rating } = req.body;
    
        if (!id_order || !rating) {
            return res.status(400).json({ success: false, message: 'ID pesanan dan status wajib diisi' });
        }
    
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
    
            // Perbarui status pesanan
            const [result] = await connection.query(
                `UPDATE tbl_pesanan SET tingkat_kepuasan = ? WHERE id_pesanan = ?;`,
                [rating, id_order]
            );
    
            if (result.affectedRows === 0) {
                throw new Error('Pesanan tidak ditemukan');
            }
    
            await connection.commit();
            res.status(200).json({ success: true, message: 'Rating pesanan berhasil diperbarui' });
        } catch (err) {
            if (connection) {
                await connection.rollback();
            }
            console.error('Error updating order status:', err);
            res.status(500).json({ success: false, message: 'Terjadi kesalahan saat memperbarui rating pesanan' });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },   

    async deleteOrder(req, res) {
        let idorder = req.params.id;

        if (idorder) {
            try {
                await pool.query(
                    `DELETE FROM tbl_pesanan WHERE id_pesanan = ?`, [idorder]
                );
                res.status(200).json({ success: true, message: 'Penghapusan berhasil' });
            } catch (err) {
                console.error('Delete error:', err);
                res.status(500).json({ success: false, message: 'Delete failed' });
            }
        } else {
            console.log('Order ID is required');
            res.status(400).json({ success: false, message: 'Order ID is required' });
        }
    },

    async getTotalOrder(req, res) {
        let year = req.params.year; // Mengambil parameter tahun dari URL
        if (!year) {
            year = new Date().getFullYear(); // Jika tidak ada tahun yang disediakan, gunakan tahun saat ini
        }

        try {
            const [result] = await pool.query(
                `SELECT COUNT(*) as total_orders FROM tbl_pesanan WHERE YEAR(pesanan_tanggal) = ?`,
                [year]
            );

            // Mengembalikan jumlah total pesanan
            res.json({ success: true, total_orders: result[0].total_orders });
        } catch (err) {
            console.error('Query error:', err);
            res.status(500).json({ success: false, message: 'Query failed' });
        }
    },
    async getAllOrder(req, res) {
        let now = new Date();
        let startDate;
    
        switch (req.params.range) {
            case '1day':
                startDate = new Date(now.setDate(now.getDate() - 1));
                break;
            case '7days':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case '1month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case '3months':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '6months':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '1year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // Default 1 year
        }
    
        try {
            // Query untuk mendapatkan jumlah pesanan per hari dalam rentang waktu tertentu
            const [ordersPerDay] = await pool.query(
                `SELECT DATE(pesanan_tanggal) as order_date, COUNT(*) as jumlah 
                FROM tbl_pesanan 
                WHERE pesanan_tanggal >= ? 
                GROUP BY DATE(pesanan_tanggal)
                ORDER BY order_date ASC`,
                [startDate]
            );
    
            // Query untuk mendapatkan total pesanan dalam setahun (tidak terpengaruh filter)
            const [totalOrders] = await pool.query(
                `SELECT COUNT(*) as jumlah 
                FROM tbl_pesanan 
                WHERE YEAR(pesanan_tanggal) = YEAR(CURDATE())`
            );
    
            // Mengembalikan dua data: jumlah total pesanan per hari dalam rentang waktu tertentu dan total pesanan dalam setahun
            res.json({ 
                success: true, 
                orders_per_day: ordersPerDay, 
                total_orders: totalOrders[0].jumlah 
            });
        } catch (err) {
            console.error('Query error:', err);
            res.status(500).json({ success: false, message: 'Query failed' });
        }
    }
};
