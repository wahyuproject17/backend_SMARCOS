const router = require('express').Router();
const dashboardController = require('../controllers').dashboard;
const tulisanController = require('../controllers').tulisan;
const verifyUser = require('../initializers/verify');

router.get('/get-ikan', dashboardController.getIkan);
router.get('/get-ikan/:id', dashboardController.getIkanById);
router.post('/add-ikan', verifyUser.isLogin, dashboardController.uploadImage, dashboardController.createIkan);
router.put('/edit-ikan/:id', verifyUser.isLogin, dashboardController.uploadImage, dashboardController.editIkan);
router.delete('/delete-ikan/:id', verifyUser.isLogin, dashboardController.deleteIkan);
router.get('/get-total-ikan', dashboardController.getTotalIkan);
router.get('/get-stock', dashboardController.getStockByJenisIkan);
router.post('/get-chatbot', dashboardController.getStockForChatbot);
router.get('/get-jenisikan', dashboardController.getTotalJenisIkan);

router.get('/get-benih', dashboardController.getBenih);
router.post('/add-benih', verifyUser.isLogin, dashboardController.createBenih);
router.put('/edit-benih/:id', verifyUser.isLogin, dashboardController.editBenih);
router.delete('/delete-benih/:id', verifyUser.isLogin, dashboardController.deleteBenih);

router.get('/get-konsumsi', dashboardController.getKonsumsi);
router.post('/add-konsumsi', verifyUser.isLogin, dashboardController.createKonsumsi);
router.put('/edit-konsumsi/:id', verifyUser.isLogin, dashboardController.editKonsumsi);
router.delete('/delete-konsumsi/:id', verifyUser.isLogin, dashboardController.deleteKonsumsi);

router.get('/get-allikan', verifyUser.isLogin, dashboardController.getAllIkan);

router.get('/tulisan', tulisanController.showTulisan);
router.post('/add-tulisan', verifyUser.isLogin, tulisanController.addTulisan);
router.put('/edit-tulisan/:id', verifyUser.isLogin, tulisanController.editTulisan);

module.exports = router;