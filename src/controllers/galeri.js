const database = require('../initializers/database');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const pool = mysql.createPool(database);

pool.on('error', (err) => {
  console.error(err);
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

  getGallery(req, res) {
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(`SELECT * FROM tbl_gallery`, function (error, results) {
        if (error) throw error;
        res.send(results);
      });
      connection.release();
    });
  },

  getGalleryById(req, res) {
    const galleryId = req.params.id;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(`SELECT * FROM tbl_gallery WHERE id_gallery = ?`, [galleryId], function (error, results) {
        if (error) throw error;
        res.send(results);
      });
      connection.release();
    });
  },

  createGallery(req, res) {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (title && description && imageUrl) {
      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
          `INSERT INTO tbl_gallery (title, description, image_url) VALUES (?, ?, ?)`,
          [title, description, imageUrl],
          function (error, results) {
            if (error) throw error;
            res.send({ message: 'Gallery item created successfully', id: results.insertId });
          }
        );
        connection.release();
      });
    } else {
      res.status(400).send({ message: 'All fields are required' });
    }
  },

  updateGallery(req, res) {
    const galleryId = req.params.id;
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (title && description) {
      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
          `UPDATE tbl_gallery SET title = ?, description = ?, image_url = COALESCE(?, image_url) WHERE id_gallery = ?`,
          [title, description, imageUrl, galleryId],
          function (error, results) {
            if (error) throw error;
            res.send({ message: 'Gallery item updated successfully' });
          }
        );
        connection.release();
      });
    } else {
      res.status(400).send({ message: 'All fields are required' });
    }
  },

  deleteGallery(req, res) {
    const galleryId = req.params.id;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(`DELETE FROM tbl_gallery WHERE id_gallery = ?`, [galleryId], function (error, results) {
        if (error) throw error;
        res.send({ message: 'Gallery item deleted successfully' });
      });
      connection.release();
    });
  }
};
