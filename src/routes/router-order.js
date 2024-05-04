const router = require('express').Router();
const userController = require('../controllers').user;
const verifyUser = require('../initializers/verify');

router.get('/get-order', verifyUser.isLogin, userController.getOrder);
router.get('/get-order/:id', verifyUser.isLogin, userController.getOrderById);
router.post('/add-order', verifyUser.isLogout, userController.createOrder);
router.put('/edit-order/:id', verifyUser.isLogin, userController.updateOrder);
router.delete('/delete-order/:id', verifyUser.isLogin, userController.deleteOrder)

module.exports = router;