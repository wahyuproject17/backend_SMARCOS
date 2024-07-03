const express = require('express');
const router = express.Router();
const galleryController = require('../controllers').galery;
const verifyUser = require('../initializers/verify')

router.get('/get-gallery', galleryController.getGallery);
router.get('/get-gallery/:id', galleryController.getGalleryById);
router.post('/add-gallery', verifyUser.isLogin, galleryController.uploadImage, galleryController.createGallery);
router.put('/edit-gallery/:id', verifyUser.isLogin, galleryController.uploadImage, galleryController.updateGallery);
router.delete('/delete-gallery/:id', verifyUser.isLogin, galleryController.deleteGallery);

module.exports = router;
