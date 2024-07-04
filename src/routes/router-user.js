const router = require('express').Router();
const userController = require('../controllers').user;
const verifyUser = require('../initializers/verify');

router.get('/get-user', verifyUser.isLogin, userController.getUser);
router.get('/get-user/:id', verifyUser.isLogin, userController.getUserById);
router.post('/add-user', userController.createUser);
router.put('/edit-user/:id', verifyUser.isLogin, userController.updateUser);
router.delete('/delete-user/:id', verifyUser.isLogin, userController.deleteUser);
router.get('/total-user', verifyUser.isLogin, userController.getTotalUser);

module.exports = router;