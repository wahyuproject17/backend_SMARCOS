const router = require('express').Router();
const adminController = require('../controllers').admin;
const verifyUser = require('../initializers/verify');

router.post('/add-admin', verifyUser.isLogout, adminController.AddAdmin);

module.exports = router;