const multer = require("multer");
const path = require("path");
const tools = require("./validation");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "./../files/"),
    filename: function (req, file, cb) {
        cb(null, tools.makeid(15) + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    let allowed_types = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
        "jpg",
        "jpeg",
        "png",
        "webp",
    ];
    if (allowed_types.includes(file.mimetype)) {
        return cb(null, true);
    } else {
        req.fileValidationError = 'Only JPG/PNG/JPEG/WEBP files are allowed!';
        cb("Upload Error Images Only!!!", false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20000000
    }
}).single('nama_file');

// Middleware untuk menghapus file lama sebelum mengunggah yang baru
function uploadDeleteOld(req, res, next) {
    // Cek apakah ada file lama yang perlu dihapus
    if (req.file && req.file.filename) {
        const oldFilePath = path.join(__dirname, "./../files/", req.file.filename);
        // Hapus file lama
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.error('Gagal menghapus file lama:', err);
            } else {
                console.log('File lama berhasil dihapus');
            }
            // Lanjutkan proses upload file baru
            upload(req, res, next);
        });
    } else {
        // Jika tidak ada file lama, lanjutkan langsung dengan upload file baru
        upload(req, res, next);
    }
}

module.exports = uploadDeleteOld;