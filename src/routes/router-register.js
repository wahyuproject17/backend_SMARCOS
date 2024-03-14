const router = require('express').Router();
const registerController = require('../controllers').register;
const verifyUser = require('../initializers/verify');

router.post('/save', verifyUser.isLogout, registerController.saveRegister);

module.exports = router;