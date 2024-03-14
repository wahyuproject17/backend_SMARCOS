const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const verifyUser = require('../initializers/verify');

router.get('/dashboard', verifyUser.isLogin, dashboardController.Dashboard);
router.post('/add-ikan', verifyUser.isLogin, dashboardController.AddIkan);

module.exports = router;