const pool = require('../initializers/database');
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = {
    async addTulisan(req, res) {
        let ucapan = req.body.ucapan;
        let alamat = req.body.alamat;
        let telepon = req.body.telepon;
        let instagram = req.body.instagram;
        let email = req.body.email;

        if (ucapan && alamat && telepon && instagram && email) {
            try {
                await pool.query(
                    `INSERT INTO tbl_tulisan(ucapan, alamat, telepon, instagram, email) VALUES (?,?,?,?,?);`,
                    [ucapan, alamat, telepon, instagram, email]
                );

                req.flash('color', 'success');
                req.flash('status', 'Yes..');
                req.flash('message', 'Penambahan berhasil');
                res.redirect('/');
            } catch (error) {
                console.error('Insert error:', error);
                res.status(500).json({ success: false, message: 'Penambahan gagal' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }
    },

    async editTulisan(req, res) {
        let id = req.params.id;
        let ucapan = req.body.ucapan;
        let alamat = req.body.alamat;
        let telepon = req.body.telepon;
        let instagram = req.body.instagram;
        let email = req.body.email;

        if (ucapan && alamat && telepon && instagram && email && id) {
            try {
                await pool.query(
                    `UPDATE tbl_tulisan SET ucapan=?, alamat=?, telepon=?, instagram=?, email=? WHERE id_tulisan=?;`,
                    [ucapan, alamat, telepon, instagram, email, id]
                );
                res.status(200).json({ success: true, message: 'Pengeditan berhasil' });
            } catch (error) {
                console.error('Update error:', error);
                res.status(500).json({ success: false, message: 'Pengeditan gagal' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Data tidak lengkap' });
        }
    },

    async showTulisan(req, res) {
        try {
            const [results] = await pool.query(
                `SELECT ucapan, alamat, telepon, email, instagram FROM tbl_tulisan`
            );
            res.send(results);
        } catch (error) {
            console.error('Query error:', error);
            res.status(500).json({ success: false, message: 'Gagal menampilkan data' });
        }
    }
};
