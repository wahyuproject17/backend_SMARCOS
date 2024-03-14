const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const adminController = require ('../controllers').admin;
const verifyUser = require('../initializers/verify');

router.get('/dashboard', verifyUser.isLogin, dashboardController.dashboard);
router.post('/tambah-ikan', verifyUser.isLogin, dashboardController.inputIkan);
router.post('./save-admin', verifyUser.isLogin, adminController.saveAdmin);

module.exports = router;