const multer = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/profile/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

var profile = multer({ storage: storage });

module.exports = profile;