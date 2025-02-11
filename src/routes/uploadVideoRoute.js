const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const UploadVideoController = require("../app/Controller/UploadVideoController");

//lưu trữ static file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public", "uploads", "videos"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage });

router.post(
  "/:author",
  upload.single("fileVideo"),
  UploadVideoController.uploadVideo
);
module.exports = router;
