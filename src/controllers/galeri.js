const pool = require('../initializers/database');
const multer = require('multer');
const path = require('path');

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

module.exports = {
  uploadImage: upload.single('image'),

  async getGallery(req, res) {
    try {
      const [results] = await pool.query('SELECT * FROM tbl_gallery');
      res.send(results);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      res.status(500).send({ message: 'Error fetching gallery' });
    }
  },

  async getGalleryById(req, res) {
    const galleryId = req.params.id;
    try {
      const [results] = await pool.query('SELECT * FROM tbl_gallery WHERE id_gallery = ?', [galleryId]);
      res.send(results);
    } catch (err) {
      console.error('Error fetching gallery by ID:', err);
      res.status(500).send({ message: 'Error fetching gallery by ID' });
    }
  },

  async createGallery(req, res) {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (title && description && imageUrl) {
      try {
        const [results] = await pool.query(
          'INSERT INTO tbl_gallery (title, description, image_url) VALUES (?, ?, ?)',
          [title, description, imageUrl]
        );
        res.send({ message: 'Gallery item created successfully', id: results.insertId });
      } catch (err) {
        console.error('Error creating gallery item:', err);
        res.status(500).send({ message: 'Error creating gallery item' });
      }
    } else {
      res.status(400).send({ message: 'All fields are required' });
    }
  },

  async updateGallery(req, res) {
    const galleryId = req.params.id;
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (title && description) {
      try {
        await pool.query(
          'UPDATE tbl_gallery SET title = ?, description = ?, image_url = COALESCE(?, image_url) WHERE id_gallery = ?',
          [title, description, imageUrl, galleryId]
        );
        res.send({ message: 'Gallery item updated successfully' });
      } catch (err) {
        console.error('Error updating gallery item:', err);
        res.status(500).send({ message: 'Error updating gallery item' });
      }
    } else {
      res.status(400).send({ message: 'All fields are required' });
    }
  },

  async deleteGallery(req, res) {
    const galleryId = req.params.id;
    try {
      await pool.query('DELETE FROM tbl_gallery WHERE id_gallery = ?', [galleryId]);
      res.send({ message: 'Gallery item deleted successfully' });
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      res.status(500).send({ message: 'Error deleting gallery item' });
    }
  }
};
