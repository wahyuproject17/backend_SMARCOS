const router = require('express').Router();
const loginController = require('../controllers').login;

router.get('/logout', loginController.logout);

router.post('/auth', loginController.loginAuth);

module.exports = router;