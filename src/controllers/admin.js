const pool = require('../initializers/database');
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = {
    async getAdmin(req, res) {
        try {
            const [rows] = await pool.query(
                `SELECT id_admin, username, nama_lengkap, no_hp, email, admin_tanggal FROM tbl_admin`
            );
            res.send(rows);
        } catch (error) {
            console.error('Database connection or query error:', error);
            res.status(500).json({ success: false, message: 'Database query failed' });
        }
    },

    async getAdminById(req, res) {
        const adminId = req.params.id;
        try {
            const [rows] = await pool.query(
                `SELECT id_admin, username, nama_lengkap, no_hp, email, admin_tanggal FROM tbl_admin WHERE id_admin = ?`,
                [adminId]
            );
            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            res.status(200).json({ success: true, admin: rows[0] });
        } catch (error) {
            console.error('Database connection or query error:', error);
            res.status(500).json({ success: false, message: 'Database query failed' });
        }
    },

    async createAdmin(req, res) {
        const { username, nama_lengkap, no_hp, email, password } = req.body;

        if (username && nama_lengkap && no_hp && email && password) {
            try {
                await pool.query(
                    `INSERT INTO tbl_admin (username, nama_lengkap, no_hp, email, password) VALUES (?, ?, ?, ?, SHA2(?, 512))`,
                    [username, nama_lengkap, no_hp, email, password]
                );
                res.status(200).json({ success: true, message: 'Admin registration successful' });
            } catch (error) {
                console.error('Error inserting admin data:', error);
                res.status(500).json({ success: false, message: 'Error inserting admin data' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },

    async updateAdmin(req, res) {
        const adminId = req.params.id;
        const { username, nama_lengkap, no_hp, email, password } = req.body;

        if (username && nama_lengkap && no_hp && email) {
            const queryParams = [username, nama_lengkap, no_hp, email];
            let query = `UPDATE tbl_admin SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?`;

            if (password) {
                query += `, password = SHA2(?, 512)`;
                queryParams.push(password);
            }

            query += ` WHERE id_admin = ?`;
            queryParams.push(adminId);

            try {
                await pool.query(query, queryParams);
                res.status(200).json({ success: true, message: 'Admin update successful' });
            } catch (error) {
                console.error('Error updating admin data:', error);
                res.status(500).json({ success: false, message: 'Error updating admin data' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },

    async deleteAdmin(req, res) {
        const adminId = req.params.id;

        if (adminId) {
            try {
                await pool.query(`DELETE FROM tbl_admin WHERE id_admin = ?`, [adminId]);
                res.status(200).json({ success: true, message: 'Admin deletion successful' });
            } catch (error) {
                console.error('Error deleting admin data:', error);
                res.status(500).json({ success: false, message: 'Error deleting admin data' });
            }
        } else {
            res.status(400).json({ success: false, message: 'Admin ID is required' });
        }
    },

    async getTotalAdmin(req, res) {
        try {
            const [rows] = await pool.query(`SELECT COUNT(*) as total FROM tbl_admin`);
            res.status(200).json({ success: true, total_admins: rows[0].total });
        } catch (error) {
            console.error('Error fetching total admin count:', error);
            res.status(500).json({ success: false, message: 'Error fetching total admin count' });
        }
    }
};
