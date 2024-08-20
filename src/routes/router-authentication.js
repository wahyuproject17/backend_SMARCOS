const router = require('express').Router();
const verifyUser = require('../initializers/verify');
const authController = require('../controllers').authentication;

router.get('/logout', verifyUser.isLogin, authController.Logout);

router.post('/login', authController.Login);

router.post('/verify', verifyUser.isAdmin);

// Endpoint untuk memeriksa status login
router.get('/status', authController.authenticateToken, (req, res) => {
    res.json({ success: true, level: req.user.level });
  });

module.exports = router;