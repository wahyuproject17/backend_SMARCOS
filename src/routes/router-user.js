const router = require('express').Router();
const registerController = require('../controllers').user;
const verifyUser = require('../initializers/verify');

router.post('/add-user', verifyUser.isLogout, registerController.AddUser);

module.exports = router;