const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const port = 5000;
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const database = require('./src/initializers/database'); // Ini harus mengembalikan objek konfigurasi, bukan pool

require('dotenv').config();

// router
const userRoutes = require('./src/routes/router-user');
const adminRoutes = require('./src/routes/router-admin');
const authRoutes = require('./src/routes/router-authentication');
const dashboardRoutes = require('./src/routes/router-dashboard');
const orderRoutes = require('./src/routes/router-order');
const galeryRoutes = require('./src/routes/router-galery');

// view engine
app.set('view engine', 'ejs');

// Buat penyimpanan sesi MySQL dengan menggunakan konfigurasi pool
const sessionStore = new MySQLStore({
  // Pastikan menggunakan konfigurasi yang sama dengan pool
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_pass,
  database: process.env.db_database,
  createDatabaseTable: true // opsional, jika ingin membuat tabel sesi otomatis
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
}));

// Setup middleware session
app.use(session({
    secret: 'process.env.ADMIN_JWT_SECRET',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

// Untuk melayani file gambar
app.use('api/uploads', express.static('uploads'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/gallery', galeryRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}`);
});
