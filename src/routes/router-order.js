const router = require('express').Router();
const orderController = require('../controllers').order;
const verifyUser = require('../initializers/verify');

router.get('/get-order', orderController.getOrder);
router.get('/get-order/:id', verifyUser.isLogin, orderController.getOrderById);
router.post('/add-order', verifyUser.isLogin, orderController.createOrder);
router.put('/edit-order/:id', verifyUser.isLogin, orderController.updateOrder);
router.delete('/delete-order/:id', orderController.deleteOrder)

module.exports = router;