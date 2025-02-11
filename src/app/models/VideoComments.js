const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserVideos = require("./UserVideos");

const VideoComments = new Schema(
  {
    idVideo: { type: Schema.Types.ObjectId, ref: "UserVideos" },
    userId: { type: String, default: "" },
    fullName: { type: String, default: "" },
    userProfile: { type: String, default: "" },
    text: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    replies: {
      like: { type: Number, default: 0 },
      disLike: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("VideoComments", VideoComments);
