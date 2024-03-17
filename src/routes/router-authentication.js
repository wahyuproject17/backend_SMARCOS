const router = require('express').Router();
const verifyUser = require('../initializers/verify');
const authController = require('../controllers').authentication;

router.get('/logout', verifyUser.isLogin, authController.Logout);

router.post('/login', authController.Login);

module.exports = router;