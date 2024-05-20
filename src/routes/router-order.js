const router = require('express').Router();
const orderController = require('../controllers').order;
const verifyUser = require('../initializers/verify');

router.get('/get-order', verifyUser.isLogin, orderController.getOrder);
router.get('/get-order/:id', verifyUser.isLogin, orderController.getOrderById);
router.post('/add-order', verifyUser.isLogout, orderController.createOrder);
router.put('/edit-order/:id', verifyUser.isLogin, orderController.updateOrder);
router.delete('/delete-order/:id', verifyUser.isLogin, orderController.deleteOrder)

module.exports = router;