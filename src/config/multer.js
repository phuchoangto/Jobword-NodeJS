const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    }
});

const upload = multer({ storage });

module.exports = upload;