const router = require('express').Router();
const orderController = require('../controllers').order;
const verifyUser = require('../initializers/verify');

router.get('/get-order', verifyUser.isLogin, orderController.getOrder);
router.get('/get-order/:id', verifyUser.checkAuth, orderController.getOrderById);
router.post('/add-order', verifyUser.checkAuth, orderController.createOrder);
router.put('/edit-order/:id', verifyUser.isLogin, orderController.updateOrder);
router.put('/:id/complete', verifyUser.isLogin, orderController.updateOrderStatus);
router.put('/:id/rating', verifyUser.checkAuth, orderController.updateOrderRating);
router.delete('/delete-order/:id', verifyUser.isLogin, orderController.deleteOrder)
router.get('/get-total', orderController.getTotalOrder);
router.get('/get-total/:range', orderController.getAllOrder);
router.get('/get-kepuasan', orderController.getTingkatKepuasan);

module.exports = router;