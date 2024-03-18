const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const verifyUser = require('../initializers/verify');

router.get('/', verifyUser.isLogin, dashboardController.Dashboard);
router.post('/add-ikan', verifyUser.isLogin, dashboardController.createIkan);
router.put('/edit-ikan', verifyUser.isLogin, dashboardController.editIkan);
router.delete('/delete-ikan', verifyUser.isLogin, dashboardController.deleteIkan);

module.exports = router;