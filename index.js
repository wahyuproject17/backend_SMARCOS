// library
const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path')
const flash = require('req-flash')
const port = 3000
const bodyParser = require('body-parser')
require ('dotenv').config()

//router
const userRoutes = require('./src/routes/router-user')
const adminRoutes = require('./src/routes/router-admin')
const authRoutes = require('./src/routes/router-authentication')
const appRoutes = require('./src/routes/router-app')
const dashboardRoutes = require('./src/routes/router-dashboard')

//view engine
app.set('view engine', 'ejs');

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//library session
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'w@hyou',
  name: 'secretName',
  cookie: {
    sameSite: true,
    maxAge: 60000
  }
}))
app.use(flash())

//routes
app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/admin', adminRoutes)
app.use('/', appRoutes)

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}`)
})