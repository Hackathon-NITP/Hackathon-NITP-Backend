const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "Documents");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`.replace(/ /g, "_"));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return cb(new Error("Please upload pdf only"));
    }
    cb(undefined, true);
  },
});

module.exports = upload;
