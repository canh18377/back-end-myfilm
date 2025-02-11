const UserVideos = require("../models/UserVideos");
const ProfileUse = require("../models/ProfileUser");
const LikedVideos = require("../models/LikedVideos");
const List_Follow = require("../models/List_Follow");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
class SiteController {
  async home(req, res) {
    try {
      const ArrayVideos = await UserVideos.aggregate([
        {
          $match: {
            deleteAt: null,
          },
        },
        { $sample: { size: 5 } },
      ]);
      console.log("ArrayVideos:", ArrayVideos);
      //lay id author
      const authors = ArrayVideos.map((video) => video.author);
      //tim owner  of video
      const profileOwner = await ProfileUse.find({ author: { $in: authors } });
      //lay thong tin owner
      const infoOwner = profileOwner.map((owner) => ({
        author: owner.author,
        path: owner.profilePhoto.path,
      }));

      console.log("ifo ownerr:", infoOwner);
      //tra ve video+owner
      res.json({
        infoOwner: infoOwner,
        ArrayVideos: ArrayVideos,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async getListFollow(req, res) {
    console.log("get list:", req.params);
    try {
      const followingList = await List_Follow.findOne({
        user: req.params.author,
      });
      console.log("followingList::::", followingList);
      res.json(followingList && followingList.following);
    } catch (error) {
      console.log(error);
    }
  }
  async getVideoTym(req, res) {
    console.log("get list:", req.params);
    let ArrayVideoId = req.params.idVideo.split(",");
    ArrayVideoId = ArrayVideoId.map((id) => new ObjectId(id));
    console.log(ArrayVideoId);
    try {
      const video = await UserVideos.aggregate([
        {
          $match: { _id: { $in: ArrayVideoId } },
        },
        {
          // Tạo thêm trường tạm 'order' để lưu vị trí của ID trong ArrayVideoId
          $addFields: {
            order: { $indexOfArray: [ArrayVideoId, "$_id"] },
          },
        },
        {
          // Sắp xếp kết quả theo trường 'order'
          $sort: { order: 1 },
        },
      ]);
      if (!video) {
        res.json({ error: "Not found Video" });
        return;
      }
      console.log("video::::", video);
      res.json(video);
    } catch (error) {
      console.log(error);
    }
  }

  async following(req, res) {
    console.log("get following", req.params);
    try {
      const response = await List_Follow.findOne({
        user: req.params.author,
      });
      console.log(response);
      if (!response) {
        res.json({ Notification: "Bạn chưa theo dõi ai cả." });
        return;
      }
      if (response.following.length === 0) {
        res.json({ Notification: "Bạn chưa theo dõi ai cả." });
        return;
      }
      const listFollow = response.following.map((id) => new ObjectId(id));

      let condition = {
        deleteAt: null,
        author: { $in: listFollow },
      };

      const followingUserVideos = await UserVideos.aggregate([
        {
          $match: condition,
        },
        {
          $sort: { createdAt: -1 },
        },
        { $skip: Number.parseInt(req.params.lastVideo) },
        {
          $limit: 5, // Lấy 5 video đầu tiên
        },
      ]);
      console.log("followingUserVideos", followingUserVideos);
      if (followingUserVideos.length === 0) {
        res.json({ Notification: "Đã hết video , Hãy theo dõi thêm!" });
        return;
      }
      const authors = followingUserVideos.map((video) => video.author);
      //tim owner  of video
      const profileOwner = await ProfileUse.find({ author: { $in: authors } });
      //lay thong tin owner
      const infoOwner = profileOwner.map((owner) => ({
        author: owner.author,
        path: owner.profilePhoto.path,
      }));
      res.json({
        infoOwner: infoOwner,
        ArrayVideos: followingUserVideos,
      });
      console.log("ifo ownerr:", infoOwner);
    } catch (error) {
      console.log(error);
    }
  }
  async likeVideos(req, res) {
    console.log("liked video:", req.body);
    try {
      let response = await UserVideos.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.body.idVideo), // Tìm video theo ID
          likeBy: new mongoose.Types.ObjectId(req.body.likePerson), // Kiểm tra nếu user đã like video
        },
        {
          $pull: { likeBy: new mongoose.Types.ObjectId(req.body.likePerson) }, // Bỏ user khỏi danh sách liked
          $inc: { likes: -1 }, // Giảm số lượt like
        },
        { new: true } // Trả về tài liệu đã cập nhật
      );

      if (!response) {
        response = await UserVideos.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(req.body.idVideo), // Tìm video theo ID
          },
          {
            $push: { likeBy: new mongoose.Types.ObjectId(req.body.likePerson) },
            $inc: { likes: 1 },
          },
          { new: true } // Trả về tài liệu đã cập nhật
        );
        console.log("res", response);
      }
      console.log("res", response);
      // them vao liked Video profile

      const response2 = await LikedVideos.findOne({
        author: new mongoose.Types.ObjectId(req.body.likePerson),
      });

      let ArrayVideoLiked;

      if (response2 && response2.likedVideos.includes(req.body.idVideo)) {
        // Nếu video đã tồn tại trong likedVideos, xóa nó
        ArrayVideoLiked = await LikedVideos.findOneAndUpdate(
          {
            author: new mongoose.Types.ObjectId(req.body.likePerson),
          },
          { $pull: { likedVideos: req.body.idVideo } }, // Xóa video khỏi likedVideos
          { new: true, upsert: true }
        );
      } else {
        // Nếu video chưa có, thêm nó vào likedVideos
        ArrayVideoLiked = await LikedVideos.findOneAndUpdate(
          {
            author: new mongoose.Types.ObjectId(req.body.likePerson),
          },
          { $push: { likedVideos: req.body.idVideo } }, // Thêm video vào likedVideos
          { new: true, upsert: true }
        );
      }

      console.log("cac video da like", ArrayVideoLiked);

      if (response) {
        res.json(response);
      } else res.json({ error: "failure update" });
    } catch (error) {
      console.log(error);
    }
  }
  async handleFollow(req, res) {
    console.log("handle follow", req.body);
    try {
      const { isFollow, user, author } = req.body;

      if (isFollow === "isFollow") {
        // Cập nhật danh sách following của user
        const listFollowing = await List_Follow.findOneAndUpdate(
          { user: user },
          { $addToSet: { following: author } },
          { new: true, upsert: true }
        );
        console.log("handle result:", listFollowing);

        // Cập nhật danh sách follower của author
        const listFollower = await List_Follow.findOneAndUpdate(
          { user: author },
          { $addToSet: { follower: user } },
          { new: true, upsert: true }
        );
        return res.json("success");
      }

      if (isFollow === "isUnFollow") {
        // Cập nhật danh sách following của user
        const listUnFollowing = await List_Follow.findOneAndUpdate(
          { user: user },
          { $pull: { following: author } },
          { new: true }
        );
        // Cập nhật danh sách follower của author
        const listUnFollower = await List_Follow.findOneAndUpdate(
          { user: author },
          { $pull: { follower: user } },
          { new: true }
        );
        return res.json("success");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error", error });
    }
  }
}
module.exports = new SiteController();
