const pool = require('../initializers/database');
const path = require('path');
const multer = require('multer');

pool.on('error', (err) => {
    console.error('Database connection error:', err);
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

module.exports = {
    uploadImage: upload.single('foto_ikan'),

    async getIkan(req, res) {
        try {
            const [result] = await pool.query(`SELECT * FROM tbl_ikan`);
            res.send(result);
        } catch (error) {
            console.error('Error retrieving fish:', error);
            res.status(500).send({ message: 'Failed to retrieve fish data' });
        }
    },

    async getIkanById(req, res) {
        const userid = req.params.id;
        try {
            const [result] = await pool.query(`SELECT * FROM tbl_ikan WHERE id_ikan=?`, [userid]);
            res.send(result);
        } catch (error) {
            console.error('Error retrieving fish by ID:', error);
            res.status(500).send({ message: 'Failed to retrieve fish data by ID' });
        }
    },

    async createIkan(req, res) {
        const { jenis_ikan, kategori, harga_ikan } = req.body;
        const foto_ikan = req.file ? req.file.path : null;

        if (jenis_ikan && kategori && harga_ikan && foto_ikan) {
            try {
                const [results] = await pool.query(
                    `INSERT INTO tbl_ikan (jenis_ikan, kategori, harga_ikan, foto_ikan) VALUES (?, ?, ?, ?)`,
                    [jenis_ikan, kategori, harga_ikan, foto_ikan]
                );
                res.send({ message: 'Fish added successfully', id: results.insertId });
            } catch (error) {
                console.error('Error creating fish:', error);
                res.status(500).send({ message: 'Failed to add fish' });
            }
        } else {
            res.status(400).send({ message: 'All fields are required' });
        }
    },

    async editIkan(req, res) {
        const fishId = req.params.id;
        const { jenis_ikan, kategori, harga_ikan } = req.body;
        const foto_ikan = req.file ? req.file.path : null;

        if (jenis_ikan) {
            try {
                await pool.query(
                    `UPDATE tbl_ikan SET jenis_ikan = ?, kategori = ?, harga_ikan = ?, foto_ikan = COALESCE(?, foto_ikan) WHERE id_ikan = ?`,
                    [jenis_ikan, kategori, harga_ikan, foto_ikan, fishId]
                );
                res.send({ message: 'Fish data updated successfully' });
            } catch (error) {
                console.error('Error updating fish:', error);
                res.status(500).send({ message: 'Failed to update fish data' });
            }
        } else {
            res.status(400).send({ message: 'All fields are required' });
        }
    },

    async deleteIkan(req, res) {
        const fishId = req.params.id;
        try {
            await pool.query(`DELETE FROM tbl_ikan WHERE id_ikan = ?`, [fishId]);
            res.send({ message: 'Fish data deleted successfully' });
        } catch (error) {
            console.error('Error deleting fish:', error);
            res.status(500).send({ message: 'Failed to delete fish data' });
        }
    },

    async getStockByJenisIkan(req, res) {
        try {
            const [resultJenisIkan] = await pool.query(`SELECT id_ikan, jenis_ikan FROM tbl_ikan`);

            const promises = resultJenisIkan.map(async (jenisIkan) => {
                const id_ikan = jenisIkan.id_ikan;
                const jenis = jenisIkan.jenis_ikan;

                const [benih] = await pool.query(
                    `SELECT IFNULL(SUM(jumlah_ikan), 0) as total_benih FROM tbl_benih WHERE id_ikan = ?`, 
                    [id_ikan]
                );

                const [konsumsi] = await pool.query(
                    `SELECT IFNULL(SUM(jumlah_ikan), 0) as total_konsumsi FROM tbl_konsumsi WHERE id_ikan = ?`, 
                    [id_ikan]
                );

                return [
                    { jenis_ikan: jenis, kategori: 'benih', total: benih[0].total_benih },
                    { jenis_ikan: jenis, kategori: 'konsumsi', total: konsumsi[0].total_konsumsi }
                ];
            });

            const results = (await Promise.all(promises)).flat();
            res.json({ success: true, data: results });
        } catch (error) {
            console.error('Query execution error:', error);
            res.status(500).json({ success: false, message: 'Query execution failed' });
        }
    },

    async createBenih(req, res) {
        const { id_ikan, ukuran, jumlah_ikan, harga_ikan } = req.body;

        if (id_ikan && ukuran && jumlah_ikan && harga_ikan) {
            try {
                await pool.query(
                    `INSERT INTO tbl_benih (id_ikan, ukuran, jumlah_ikan, harga_ikan) VALUES (?, ?, ?, ?);`,
                    [id_ikan, ukuran, jumlah_ikan, harga_ikan]
                );
                res.send({ message: 'Fish data added successfully' });
            } catch (error) {
                console.error('Query error:', error);
                res.status(500).send({ message: 'Database query failed' });
            }
        } else {
            res.status(400).send({ message: 'All fields are required' });
        }
    },

    async editBenih(req, res) {
        const { id_benih, id_ikan, ukuran, jumlah_ikan, harga_ikan } = req.body;

        if (id_benih && id_ikan && ukuran && jumlah_ikan && harga_ikan) {
            try {
                await pool.query(
                    `UPDATE tbl_benih 
                     SET id_ikan = ?, ukuran = ?, jumlah_ikan = ?, harga_ikan = ? 
                     WHERE id_benih = ?`,
                    [id_ikan, ukuran, jumlah_ikan, harga_ikan, id_benih]
                );
                res.send({ message: 'Update successful' });
            } catch (error) {
                console.error('Query error:', error);
                res.status(500).send({ message: 'Database query failed' });
            }
        } else {
            res.status(400).send({ message: 'Data yang dimasukkan tidak lengkap!' });
        }
    },

    async deleteBenih(req, res) {
        const { id_benih } = req.params;

        if (id_benih) {
            try {
                await pool.query(
                    `DELETE FROM tbl_benih WHERE id_benih = ?`,
                    [id_benih]
                );
                res.send({ message: 'Data deleted successfully' });
            } catch (error) {
                console.error('Query error:', error);
                res.status(500).send({ message: 'Database query failed' });
            }
        } else {
            res.status(400).send({ message: 'Invalid benih ID!' });
        }
    },

    async getBenih(req, res) {
        try {
            const [result] = await pool.query(
                `SELECT tbl_ikan.jenis_ikan, tbl_ikan.foto_ikan, tbl_benih.ukuran, tbl_benih.jumlah_ikan, tbl_benih.harga_ikan 
                 FROM tbl_benih 
                 INNER JOIN tbl_ikan ON tbl_benih.id_ikan = tbl_ikan.id_ikan`
            );
            res.send(result);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).send({ message: 'Database query failed' });
        }
    },

    async createKonsumsi(req, res) {
        const { id_ikan, jumlah_ikan, harga_ikan } = req.body;

        if (id_ikan && jumlah_ikan && harga_ikan) {
            try {
                await pool.query(
                    `INSERT INTO tbl_konsumsi (id_ikan, jumlah_ikan, harga_ikan) VALUES (?, ?, ?);`,
                    [id_ikan, jumlah_ikan, harga_ikan]
                );
                res.send({ message: 'Input successful' });
            } catch (error) {
                console.error('Query error:', error);
                res.status(500).send({ message: 'Database query failed' });
            }
        } else {
            res.status(400).send({ message: 'Data yang dimasukkan tidak lengkap!' });
        }
    },

    async editKonsumsi(req, res) {
        const { id_konsumsi, id_ikan, jumlah_ikan, harga_ikan } = req.body;

        if (id_konsumsi && id_ikan && jumlah_ikan && harga_ikan) {
            try {
                await pool.query(
                    `UPDATE tbl_konsumsi 
                     SET id_ikan = ?, jumlah_ikan = ?, harga_ikan = ? 
                     WHERE id_konsumsi = ?`,
                    [id_ikan, jumlah_ikan, harga_ikan, id_konsumsi]
                );
                res.send({ message: 'Update successful' });
            } catch (error) {
                console.error('Query error:', error);
                res.status(500).send({ message: 'Database query failed' });
            }
        } else {
            res.status(400).send({ message: 'Data yang dimasukkan tidak lengkap!' });
        }
    },

    async deleteKonsumsi(req, res) {
        const { id_konsumsi } = req.params;

        if (id_konsumsi) {
            try {
                await pool.query(
                    `DELETE FROM tbl_konsumsi WHERE id_konsumsi = ?`,
                    [id_konsumsi]
                );
                res.send({ message: 'Data deleted successfully' });
            } catch (error) {
                console.error('Query error:', error);
                res.status(500).send({ message: 'Database query failed' });
            }
        } else {
            res.status(400).send({ message: 'Invalid konsumsi ID!' });
        }
    },

    async getKonsumsi(req, res) {
        try {
            const [result] = await pool.query(
                `SELECT tbl_ikan.jenis_ikan, tbl_ikan.foto_ikan, tbl_konsumsi.jumlah_ikan, tbl_konsumsi.harga_ikan 
                 FROM tbl_konsumsi 
                 INNER JOIN tbl_ikan ON tbl_konsumsi.id_ikan = tbl_ikan.id_ikan`
            );
            res.send(result);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).send({ message: 'Database query failed' });
        }
    },

    async getAllIkan(req, res) {
        try {
            const [result_benih] = await pool.query(
                `SELECT tbl_ikan.*, tbl_benih.* 
                 FROM tbl_ikan 
                 INNER JOIN tbl_benih ON tbl_ikan.id_ikan = tbl_benih.id_ikan;`
            );

            const [result_konsumsi] = await pool.query(
                `SELECT tbl_ikan.*, tbl_konsumsi.* 
                 FROM tbl_ikan 
                 INNER JOIN tbl_konsumsi ON tbl_ikan.id_ikan = tbl_konsumsi.id_ikan;`
            );

            res.send({ benih: result_benih, konsumsi: result_konsumsi });
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).send({ message: 'Database query failed' });
        }
    },

    async getTotalIkan(req, res) {
        try {
            const [resultBenih] = await pool.query(`SELECT IFNULL(SUM(jumlah_ikan), 0) as total_benih FROM tbl_benih`);
            const [resultKonsumsi] = await pool.query(`SELECT IFNULL(SUM(jumlah_ikan), 0) as total_konsumsi FROM tbl_konsumsi`);

            const totalBenih = parseInt(resultBenih[0].total_benih);
            const totalKonsumsi = parseInt(resultKonsumsi[0].total_konsumsi);
            const totalIkan = totalBenih + totalKonsumsi;

            res.json({
                success: true,
                total_ikan: totalIkan,
                detail: {
                    total_benih: totalBenih,
                    total_konsumsi: totalKonsumsi
                }
            });
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ success: false, message: 'Database query failed' });
        }
    },
    async getTotalJenisIkan(req, res) {
        try {
            // Mengambil jumlah jenis ikan yang unik
            const [result] = await pool.query(`SELECT COUNT(DISTINCT jenis_ikan) as total_jenis FROM tbl_ikan`);
            
            // Parsing hasil query
            const totalJenisIkan = parseInt(result[0].total_jenis);
    
            // Mengirimkan respons JSON
            res.json({
                success: true,
                total_jenis_ikan: totalJenisIkan
            });
        } catch (error) {
            // Menangani error query
            console.error('Query error:', error);
            res.status(500).json({ success: false, message: 'Database query failed' });
        }
    },    
    async getStockForChatbot(req, res) {
        try {
            // Ambil parameter dari body
            const { jenis_ikan, ukuran } = req.body;
            console.log(jenis_ikan, ukuran);
    
            // Kondisi untuk filter query jika parameter diberikan
            const filters = [];
            const values = [];
    
            if (jenis_ikan) {
                filters.push('tbl_ikan.jenis_ikan = ?');
                values.push(jenis_ikan);
            }
    
            if (ukuran) {
                filters.push('tbl_benih.ukuran = ?');
                values.push(ukuran);
            }
    
            // Gabungkan kondisi filter dengan 'AND' jika ada
            const filterQuery = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    
            // Query untuk mendapatkan data yang difilter
            const query = `
                SELECT 
                    tbl_ikan.jenis_ikan, 
                    tbl_benih.ukuran, 
                    IFNULL(SUM(tbl_benih.jumlah_ikan), 0) AS stock,
                    IFNULL(AVG(tbl_benih.harga_ikan), 0) AS price
                FROM tbl_ikan
                LEFT JOIN tbl_benih ON tbl_ikan.id_ikan = tbl_benih.id_ikan
                ${filterQuery}
                GROUP BY tbl_ikan.jenis_ikan, tbl_benih.ukuran
            `;
    
            // Eksekusi query
            const [results] = await pool.query(query, values);
    
            // Format data hasil query
            const formattedResults = results.map((row) => ({
                jenis_ikan: row.jenis_ikan,
                ukuran: row.ukuran || "tidak spesifik",
                stock: row.stock,
                price: row.price ? parseInt(row.price) : 0
            }));
    
            res.json({ success: true, data: formattedResults });
            console.log(formattedResults);
        } catch (error) {
            console.error('Query execution error:', error);
            res.status(500).json({ success: false, message: 'Query execution failed' });
        }
    }    
};