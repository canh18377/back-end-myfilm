const Profile = require("../models/ProfileUser");
const UserVideos = require("../models/UserVideos.js");
class UploadVideoController {
  async uploadVideo(req, res) {
    try {
      console.log("file:", req.file);
      console.log("name,limint:", req.body);
      console.log("genres", JSON.parse(req.body.genres));
      console.log("author:", req.params.author);

      //updata profile(id account === author)
      const video = await UserVideos.create({
        path: `http://localhost:8080/uploads/videos/${req.file.filename}`,
        filename: req.file.filename,
        nameVideo: req.body.nameVideo,
        limitedAge: req.body.limitedAge,
        genres: JSON.parse(req.body.genres),
        author: req.params.author,
      });
      console.log("videos:", video);
      const response = await Profile.findOneAndUpdate(
        { author: req.params.author },
        {
          $push: { videos: video._id },
        },
        { new: true }
      );
      res.json({ success: "Tải lên thành công" });
      console.log("ban upload", response);
    } catch (error) {
      console.log("errorr:", error);
      res.json({ err: "server bận, thử lại sau" });
    }
  }
}
module.exports = new UploadVideoController();
