const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 

  },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, JPEG and WEBP images are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;



 