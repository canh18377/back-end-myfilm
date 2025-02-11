const Profile = require("../models/ProfileUser");
const UserVideos = require("../models/UserVideos");
class SearchController {
  async searchUsers(req, res) {
    console.log(req.params);
    try {
      const listUsers = await Profile.find({
        name: { $regex: req.params.contentSearch, $options: "i" },
      });
      console.log("danh sach tim duoc:", listUsers);
      res.json({ listUsers: listUsers });
    } catch (error) {
      console.log(error);
    }
  }

  async searchVideos(req, res) {
    console.log(req.params);
    try {
      const listVideos = await UserVideos.find({
        nameVideo: { $regex: req.params.contentSearch, $options: "i" },
        deleteAt: null,
      });
      console.log("danh sach tim duoc:", listVideos);
      res.json({ listVideos: listVideos });
    } catch (error) {
      console.log(error);
    }
  }

  async searchTopVideos(req, res) {
    console.log(req.params);
    try {
      const listVideos = await UserVideos.find({
        nameVideo: { $regex: req.params.contentSearch, $options: "i" },
        deleteAt: null,
      })
        .sort({ likes: -1 })
        .limit(10);
      console.log("danh sach tim duoc:", listVideos);
      res.json({ listVideos: listVideos });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new SearchController();
