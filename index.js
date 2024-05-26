// library
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const cors = require('cors');
const flash = require('req-flash');
const port = 5000;
const bodyParser = require('body-parser');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql');
const database = require('./src/initializers/database');

require('dotenv').config();

// router
const userRoutes = require('./src/routes/router-user');
const adminRoutes = require('./src/routes/router-admin');
const authRoutes = require('./src/routes/router-authentication');
const appRoutes = require('./src/routes/router-app');
const dashboardRoutes = require('./src/routes/router-dashboard');
const orderRoutes = require('./src/routes/router-order');

// view engine
app.set('view engine', 'ejs');

// Tes koneksi ke database
const connection = mysql.createConnection(database);
connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL: ', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Buat penyimpanan sesi MySQL
const sessionStore = new MySQLStore(database);

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// library session
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'w@hyou',
  name: 'secretName',
  store: sessionStore,
  cookie: {
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 1 // Sesi berlaku selama 1 jam
  }
}));
app.use(flash());

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/order', orderRoutes);
app.use('/', appRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}`);
});
