const router = require('express').Router();
const adminController = require('../controllers').admin;
const verifyUser = require('../initializers/verify');

router.get('/get-admin', verifyUser.isLogin, adminController.getAdmin);
router.get('/get-admin/:id', verifyUser.isLogin, adminController.getAdminById);
router.post('/add-admin', adminController.createAdmin);
router.put('/edit-admin/:id', verifyUser.isLogin, adminController.updateAdmin);
router.delete('/delete-admin/:id', verifyUser.isLogin, adminController.deleteAdmin)

module.exports = router;