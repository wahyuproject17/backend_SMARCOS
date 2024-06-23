const express = require('express');
const router = express.Router();
const galleryController = require('../controllers').galery;

router.get('/get-gallery', galleryController.getGallery);
router.get('/get-gallery/:id', galleryController.getGalleryById);
router.post('/add-gallery', galleryController.uploadImage, galleryController.createGallery);
router.put('/edit-gallery/:id', galleryController.uploadImage, galleryController.updateGallery);
router.delete('/delete-gallery/:id', galleryController.deleteGallery);

module.exports = router;
