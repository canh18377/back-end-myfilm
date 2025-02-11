const express = require("express");
const router = express.Router();
const SearchController = require("../app/Controller/SearchController");
router.get("/users/:contentSearch", SearchController.searchUsers);
router.get("/videos/:contentSearch", SearchController.searchVideos);
router.get("/topVideos/:contentSearch", SearchController.searchTopVideos);
router.get("/:contentSearch", SearchController.searchTopVideos);
module.exports = router;
