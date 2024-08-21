const pool = require('../initializers/database');
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = {
    async createOrder(req, res) {
        let id_user = req.userId;
        let jenisikan = req.body.jenisikan;
        let jumlahikan = req.body.jumlah;
        let hargasatuan = req.body.hargaikan;
        let harga = jumlahikan * hargasatuan;
        let ukuran = req.body.ukuran;
        let kategori = req.body.kategori; // Tambahkan kategori: 'benih' atau 'konsumsi'
    
        if (id_user && jenisikan && jumlahikan && harga && kategori) {
            let connection;
            try {
                connection = await pool.getConnection();
                await connection.beginTransaction();
    
                // Insert into tbl_pesanan
                const [insertResult] = await connection.query(
                    `INSERT INTO tbl_pesanan(id_user, jenis_ikan, jumlah_ikan, ukuran, harga, kategori) VALUES (?, ?, ?, ?, ?, ?);`,
                    [id_user, jenisikan, jumlahikan, ukuran, harga, kategori]
                );
    
                // Pilih tabel berdasarkan kategori
                let updateTable = kategori === 'benih' ? 'tbl_benih' : 'tbl_konsumsi';
    
                // Update jumlah ikan in the selected table
                await connection.query(
                    `UPDATE ${updateTable} JOIN tbl_ikan i ON ${updateTable}.id_ikan = i.id_ikan SET ${updateTable}.jumlah_ikan = ${updateTable}.jumlah_ikan - ? WHERE i.jenis_ikan = ?;`,
                    [jumlahikan, jenisikan]
                );
    
                await connection.commit();
                console.log('Order created successfully and fish quantity updated');
                res.status(200).json({ success: true, message: 'Pesanan berhasil ditambahkan dan jumlah ikan berhasil diperbarui' });
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
            console.log('Incomplete data');
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

    async getOrderById(req, res) {
        let id = req.params.idpesanan;
        try {
            const [result] = await pool.query(
                `SELECT * FROM tbl_pesanan JOIN tbl_user ON tbl_pesanan.id_user = tbl_user.id_user WHERE id_pesanan = ?`, 
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

        if (id_user && jenisikan && jumlahikan && harga) {
            try {
                await pool.query(
                    `UPDATE tbl_pesanan SET jumlah_ikan = ?, harga = ? WHERE id_pesanan = ?;`,
                    [jumlahikan, harga, id_order]
                );
                res.status(200).json({ success: true, message: 'Ubah pesanan berhasil' });
            } catch (err) {
                console.error('Update error:', err);
                res.status(500).json({ success: false, message: 'Update failed' });
            }
        } else {
            console.log('Incomplete data');
            res.status(400).json({ success: false, message: 'Mohon cek kembali data yang anda masukkan' });
        }
    },

    async deleteOrder(req, res) {
        let idorder = req.params.idpesanan;

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
    }
};
