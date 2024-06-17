const database = require('../initializers/database');
let mysql = require('mysql');
let pool = mysql.createPool(database);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    getUser(req, res) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM tbl_user`, function (error, result) {
                    connection.release();
                    if (error) throw error;
                    res.send(result);
                }
            );
        });
    },
    getUserById(req, res) {
        const userid = req.params.id;
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `SELECT * FROM tbl_user WHERE id_user=?`, [userid],
                function (error, result) {
                    connection.release();
                    if (error) throw error;
                    res.send(result);
                }
            );
        });
    },
    createUser(req, res) {
        let { username, namalengkap: nama_lengkap, nohp: no_hp, email, jenkel, alamat, pass: password } = req.body;

        console.log("Request Data: ", req.body); // Log data yang diterima

        if (username && nama_lengkap && no_hp && email && alamat && password) {
            pool.getConnection(function (err, connection) {
                if (err) {
                    console.error('Database connection error:', err);
                    res.status(500).json({ success: false, message: 'Database connection failed' });
                    return;
                }

                connection.query(
                    `INSERT INTO tbl_user (username, nama_lengkap, no_hp, email, jenkel, alamat, password) VALUES (?,?,?,?,?,?,SHA2(?,512));`,
                    [username, nama_lengkap, no_hp, email, jenkel, alamat, password],
                    function (error, results) {
                        connection.release();

                        if (error) {
                            console.error('Error inserting data:', error);
                            res.status(500).json({ success: false, message: 'Error inserting data' });
                            return;
                        }

                        console.log('User registered successfully');
                        res.status(200).json({ success: true, message: 'Registrasi berhasil' });
                    }
                );
            });
        } else {
            console.log('Missing required fields');
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },
    updateUser(req, res) {
        let userid = req.params.id;
        let { username, namalengkap: nama_lengkap, nohp: no_hp, email, jenkel, alamat, pass: password } = req.body;

        if (username && nama_lengkap && no_hp && email && alamat && password) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    `UPDATE tbl_user SET username = ?, nama_lengkap = ?, no_hp = ?, email = ?, jenkel = ?, alamat = ?, password = SHA2(?, 512) WHERE id_user = ?;`,
                    [username, nama_lengkap, no_hp, email, jenkel, alamat, password, userid], function (error, result) {
                        connection.release();
                        if (error) {
                            console.error('Error updating data:', error);
                            res.status(500).json({ success: false, message: 'Error updating data' });
                            return;
                        }
                        res.status(200).json({ success: true, message: 'Ubah data berhasil' });
                    }
                );
            });
        } else {
            res.status(400).json({ success: false, message: 'Missing required fields' });
        }
    },
    deleteUser(req, res) {
        let userid = req.params.id;

        if (userid) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(
                    `DELETE FROM tbl_user WHERE id_user = ?`, [userid],
                    function (error, result) {
                        connection.release();
                        if (error) {
                            console.error('Error deleting data:', error);
                            res.status(500).json({ success: false, message: 'Error deleting data' });
                            return;
                        }
                        res.status(200).json({ success: true, message: 'Penghapusan berhasil' });
                    }
                );
            });
        } else {
            res.status(400).json({ success: false, message: 'User ID is required' });
        }
    }
};
