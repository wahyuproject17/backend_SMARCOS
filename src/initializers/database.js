require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pass,
    database: process.env.db_database,
    timezone: process.env.db_timezone,
    charset: process.env.db_charset,
    dateStrings: process.env.dateStrings === 'true' // Konversi ke boolean jika perlu
});

pool.on('error', (err) => {
    console.error('Database error:', err);
});

module.exports = pool;
