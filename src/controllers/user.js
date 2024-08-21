const pool = require('../initializers/database');
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = {
    async getUser(req, res) {
        try {
            const [results] = await pool.query(
                `SELECT id_user, username, nama_lengkap, no_hp, email, jenkel, alamat, user_tanggal FROM tbl_user`
            );
            res.send(results);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ success: false, message: 'Error fetching users' });
        }
    },

    async getUserById(req, res) {
        const userid = req.params.id;
        try {
            const [results] = await pool.query(
                `SELECT id_user, username, nama_lengkap, no_hp, email, jenkel, alamat FROM tbl_user WHERE id_user=?`, 
                [userid]
            );
            res.send(results);
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            res.status(500).json({ success: false, message: 'Error fetching user by ID' });
        }
    },

    async createUser(req, res) {
        let { username, nama_lengkap, no_hp, email, jenkel, alamat, password } = req.body;

        if (username && nama_lengkap && no_hp && email && alamat && password) {
            try {
                await pool.query(
                    `INSERT INTO tbl_user (username, nama_lengkap, no_hp, email, jenkel, alamat, password) VALUES (?,?,?,?,?,?,SHA2(?,512));`,
                    [username, nama_lengkap, no_hp, email, jenkel, alamat, password]
                );
                res.status(200).json({ success: true, message: 'Registrasi berhasil' });
            } catch (error) {
                console.error('Error inserting user:', error);
                res.status(500).json({ success: false, message: 'Error inserting user' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },

    async updateUser(req, res) {
        let userid = req.params.id;
        let { username, nama_lengkap, no_hp, email, jenkel, alamat, password } = req.body;

        if (username && nama_lengkap && no_hp && email && alamat) {
            try {
                if (password) {
                    // Update with password
                    await pool.query(
                        `UPDATE tbl_user SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?, jenkel = ?, alamat = ?, password = SHA2(?, 512) WHERE id_user = ?;`,
                        [username, nama_lengkap, no_hp, email, jenkel, alamat, password, userid]
                    );
                } else {
                    // Update without password
                    await pool.query(
                        `UPDATE tbl_user SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?, jenkel = ?, alamat = ? WHERE id_user = ?;`,
                        [username, nama_lengkap, no_hp, email, jenkel, alamat, userid]
                    );
                }

                res.status(200).json({ success: true, message: 'Ubah data berhasil' });
            } catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({ success: false, message: 'Error updating user' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },

    async deleteUser(req, res) {
        let userid = req.params.id;

        if (userid) {
            try {
                await pool.query(
                    `DELETE FROM tbl_user WHERE id_user = ?`, [userid]
                );
                res.status(200).json({ success: true, message: 'Penghapusan berhasil' });
            } catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ success: false, message: 'Error deleting user' });
            }
        } else {
            res.status(400).json({ success: false, message: 'User ID is required' });
        }
    },

    async getTotalUser(req, res) {
        try {
            const [results] = await pool.query(
                `SELECT COUNT(*) as total FROM tbl_user`
            );
            res.status(200).json({ success: true, total_users: results[0].total });
        } catch (error) {
            console.error('Error fetching total users:', error);
            res.status(500).json({ success: false, message: 'Error fetching total users' });
        }
    }
};
