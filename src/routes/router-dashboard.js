const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const tulisanController = require('../controllers').tulisan;
const verifyUser = require('../initializers/verify');

router.get('/', verifyUser.isLogin, dashboardController.Dashboard);
router.get('/get-ikan', verifyUser.isLogin, dashboardController.getIkan);
router.get('/get-ikan/:id', verifyUser.isLogin, dashboardController.getIkanById);
router.post('/add-ikan', verifyUser.isLogin, dashboardController.createIkan);
router.put('/edit-ikan/:id', verifyUser.isLogin, dashboardController.editIkan);
router.delete('/delete-ikan/:id', verifyUser.isLogin, dashboardController.deleteIkan);
router.get('/get-total-ikan', dashboardController.getTotalIkan);

router.get('/get-benih', verifyUser.isLogin, dashboardController.getBenih);
router.post('/add-benih', verifyUser.isLogin, dashboardController.createBenih);
router.put('/edit-benih/:id', verifyUser.isLogin, dashboardController.editBenih);
router.delete('/delete-benih/:id', verifyUser.isLogin, dashboardController.deleteBenih);

router.get('/get-konsumsi', verifyUser.isLogin, dashboardController.getKonsumsi);
router.post('/add-konsumsi', verifyUser.isLogin, dashboardController.createKonsumsi);
router.put('/edit-konsumsi/:id', verifyUser.isLogin, dashboardController.editKonsumsi);
router.delete('/delete-konsumsi/:id', verifyUser.isLogin, dashboardController.deleteKonsumsi);

router.get('/tulisan', verifyUser.isLogin, tulisanController.showTulisan);
router.post('/add-tulisan', verifyUser.isLogin, tulisanController.addTulisan);
router.put('/edit-tulisan/:id', verifyUser.isLogin, tulisanController.editTulisan);

module.exports = router;