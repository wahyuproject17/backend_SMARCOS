const router = require('express').Router();
const dashboardController = require('../controllers/dashboard');
const verifyUser = require('../initializers/verify');

router.get('/dashboard', verifyUser.isLogin, dashboardController.dashboard);
router.post('/save', verifyUser.isLogin, dashboardController.inputIkan);

module.exports = router;