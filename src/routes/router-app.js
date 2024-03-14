const router = require('express').Router();
const homeController = require('../controllers').home;
const profileController = require('../controllers').profile;
const verifyUser = require('../initializers/verify');

router.get('/', verifyUser.isLogin, homeController.Home);
router.get('/profile', verifyUser.isLogin, profileController.Profile);

module.exports = router;