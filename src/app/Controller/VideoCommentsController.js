const UserVideos = require("../models/UserVideos.js");
const Profile = require("../models/ProfileUser.js");
const VideoComments = require("../models/VideoComments.js");
class VideoCommentsController {
  async getData(req, res) {
    try {
      console.log("id video:", req.params);
      //lấy video của id
      const video = await UserVideos.findOne({ _id: req.params.idVideo });
      console.log("video tim thay :", video);
      //tìm kiếm tác giả
      const owner = await Profile.findOne({ author: video.author });
      console.log("owner info:", owner);
      //lấy thông tin tác giả
      const { name, profilePhoto, author } = owner;
      //lấy ra comments của video
      const videocomments = await VideoComments.find({
        idVideo: req.params.idVideo,
      }).sort({ createdAt: -1 });
      console.log("comment video:", videocomments);
      res.json({
        video: video,
        ownerInfo: { name, profilePhoto, author },
        videoComments: videocomments,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async storeComment(req, res) {
    try {
      console.log("comment:", req.body);
      const {
        userId,
        avatarUrl,
        userProfile,
        fullName,
        text,
        idVideo,
        replies,
      } = req.body;
      const response = await VideoComments.create({
        userId: userId,
        fullName: fullName,
        text: text,
        avatarUrl: avatarUrl,
        idVideo: idVideo,
        userProfile: userProfile,
      });
      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteComment(req, res) {
    try {
      console.log(req.body);
      const response = await VideoComments.findByIdAndDelete(
        req.body.idComment,
        { new: true }
      );
      console.log(response);
      if (response) {
        res.json({ success: `Đã xóa bình luận:${response.text}` });
      } else res.json({ error: "Có lỗi xảy ra" });
    } catch (error) {
      console.log(error);
    }
  }
  async updateComment(req, res) {
    try {
      console.log(req.body);
      const response = await VideoComments.findOneAndUpdate(
        { _id: req.body.idComment },
        {
          text: req.body.commentContent,
        },
        { new: true }
      );
      console.log(response);
      if (response) {
        res.json({ success: `Update bình luận --> ${response.text}` });
      } else res.json({ error: "Có lỗi xảy ra " });
    } catch (error) {
      console.log(error);
    }
  }
  async dis_LikeComment(req, res) {
    console.log(req.body);
    const like_disLike_List = JSON.parse(req.body.like_disLike_List);
    console.log("data gui len:", like_disLike_List);

    try {
      const response = await VideoComments.updateMany(
        { _id: { $in: like_disLike_List.like } },
        {
          $inc: { "replies.like": 1 },
        },
        {
          new: true,
        }
      );
      const response1 = await VideoComments.updateMany(
        { _id: { $in: like_disLike_List.disLike } },
        {
          $inc: { "replies.disLike": 1 },
        },
        {
          new: true,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new VideoCommentsController();
