// library
const express = require('express')
const app = express()
const session = require('express-session')
const path = require('path')
const flash = require('req-flash')
const port = 3000
const bodyParser = require('body-parser')
const response = require('./response')

//router
const registerRoutes = require('./src/routes/router-register')
const loginRoutes = require('./src/routes/router-login')
const appRoutes = require('./src/routes/router-app')
const dashboardRoutes = require('./src/routes/router-dashboard')

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
app.use('/login', loginRoutes)
app.use('/register', registerRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/', appRoutes)

app.listen(port, () => {
  console.log(`Server berjalan di port: ${port}`)
})