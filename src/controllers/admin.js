const database = require('../initializers/database');
const mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    getAdmin(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                return res.status(500).json({ success: false, message: 'Database connection failed' });
            }
            connection.query(
                `SELECT id_admin, username, nama_lengkap, no_hp, email, admin_tanggal FROM tbl_admin`,
                function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Error fetching admin data:', error);
                        return res.status(500).json({ success: false, message: 'Error fetching admin data' });
                    }
                    res.send(result);
                }
            );
        });
    },

    getAdminById(req, res) {
        const adminId = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                return res.status(500).json({ success: false, message: 'Database connection failed' });
            }
            connection.query(
                `SELECT id_admin, username, nama_lengkap, no_hp, email, admin_tanggal FROM tbl_admin WHERE id_admin = ?`,
                [adminId],
                function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Error fetching admin data:', error);
                        return res.status(500).json({ success: false, message: 'Error fetching admin data' });
                    }
                    if (result.length === 0) {
                        return res.status(404).json({ success: false, message: 'Admin not found' });
                    }
                    res.status(200).json({ success: true, admin: result[0] });
                }
            );
        });
    },

    createAdmin(req, res) {
        const { username, nama_lengkap, no_hp, email, password } = req.body;

        if (username && nama_lengkap && no_hp && email && password) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    return res.status(500).json({ success: false, message: 'Database connection failed' });
                }
                connection.query(
                    `INSERT INTO tbl_admin (username, nama_lengkap, no_hp, email, password) VALUES (?,?,?,?,SHA2(?, 512));`,
                    [username, nama_lengkap, no_hp, email, password],
                    function (error, results) {
                        connection.release();
                        if (error) {
                            console.error('Error inserting admin data:', error);
                            return res.status(500).json({ success: false, message: 'Error inserting admin data' });
                        }
                        res.status(200).json({ success: true, message: 'Admin registration successful' });
                    }
                );
            });
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },

    updateAdmin(req, res) {
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

            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    return res.status(500).json({ success: false, message: 'Database connection failed' });
                }
                connection.query(query, queryParams, function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Error updating admin data:', error);
                        return res.status(500).json({ success: false, message: 'Error updating admin data' });
                    }
                    res.status(200).json({ success: true, message: 'Admin update successful' });
                });
            });
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },

    deleteAdmin(req, res) {
        const adminId = req.params.id;

        if (adminId) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    return res.status(500).json({ success: false, message: 'Database connection failed' });
                }
                connection.query(
                    `DELETE FROM tbl_admin WHERE id_admin = ?`, [adminId],
                    function (error, result) {
                        connection.release();
                        if (error) {
                            console.error('Error deleting admin data:', error);
                            return res.status(500).json({ success: false, message: 'Error deleting admin data' });
                        }
                        res.status(200).json({ success: true, message: 'Admin deletion successful' });
                    }
                );
            });
        } else {
            res.status(400).json({ success: false, message: 'Admin ID is required' });
        }
    },

    getTotalAdmin(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Database connection error:', err);
                return res.status(500).json({ success: false, message: 'Database connection failed' });
            }
            connection.query(
                `SELECT COUNT(*) as total FROM tbl_admin`,
                function (error, result) {
                    connection.release();
                    if (error) {
                        console.error('Error fetching total admin count:', error);
                        return res.status(500).json({ success: false, message: 'Error fetching total admin count' });
                    }
                    res.status(200).json({ success: true, total_admins: result[0].total });
                }
            );
        });
    }
};
