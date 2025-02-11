const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Khởi tạo multer middleware để xử lý form data

const VideoCommentsController = require("../app/Controller/VideoCommentsController");
router.post("/storeComment", VideoCommentsController.storeComment);
router.delete("/deleteComment", VideoCommentsController.deleteComment);
router.put("/updateComment", VideoCommentsController.updateComment);
router.post(
  "/dis_likeComment",
  upload.none(),
  VideoCommentsController.dis_LikeComment
);
router.get("/:idVideo", VideoCommentsController.getData);

module.exports = router;
