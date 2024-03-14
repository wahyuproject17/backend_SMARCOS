const router = require('express').Router();
const loginController = require('../controllers').authentication;

router.get('/logout', loginController.Logout);

router.post('/login', loginController.Login);

module.exports = router;