require('dotenv').config();
const mysql = require('mysql2/promise');

// Buat pool koneksi database
const pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.db_database,
    timezone: process.env.db_timezone,
    charset: process.env.db_charset,
    dateStrings: process.env.dateStrings === 'true' // Konversi string ke boolean
});

// Coba koneksi dan lakukan query
async function testConnection() {
    try {
        const [rows, fields] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Query result:', rows);
    } catch (err) {
        console.error('Database query error:', err);
    } finally {
        await pool.end(); // Menutup pool koneksi setelah tes
    }
}

// Jalankan tes koneksi
testConnection();
