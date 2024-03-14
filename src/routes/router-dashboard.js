const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const verifyUser = require('../initializers/verify');

router.get('/dashboard', verifyUser.isLogin, dashboardController.dashboard);
router.post('/tambah-ikan', verifyUser.isLogin, dashboardController.AddIkan);

module.exports = router;