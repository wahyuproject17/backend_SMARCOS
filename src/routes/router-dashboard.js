const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const tulisanController = require('../controllers').tulisan;
const verifyUser = require('../initializers/verify');

router.get('/', verifyUser.isLogin, dashboardController.Dashboard);
router.get('/get-ikan', dashboardController.getIkan);
router.get('/get-ikan/:id', verifyUser.isLogin, dashboardController.getIkanById);
router.post('/add-ikan', verifyUser.isLogin, dashboardController.createIkan);
router.put('/edit-ikan/:id', verifyUser.isLogin, dashboardController.editIkan);
router.delete('/delete-ikan/:id', verifyUser.isLogin, dashboardController.deleteIkan);

router.get('/tulisan', tulisanController.showTulisan);
router.post('/add-tulisan', tulisanController.addTulisan);
router.put('/edit-tulisan/:id', verifyUser.isLogin, tulisanController.editTulisan);

module.exports = router;