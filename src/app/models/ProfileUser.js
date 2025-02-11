const mongoose = require("mongoose");
const UserVideos = require("./UserVideos"); // Import UserVideos schema
const Account = require("./Account");
const { Schema } = mongoose;

const Profile = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "Account" },
  name: { type: String, default: "bạn chưa có tên" },
  profilePhoto: {
    filename: { type: String, default: "" },
    path: {
      type: String,
      default: "http://localhost:8080/uploads/images/DefaultAvatar.png",
    },
  },
  videos: [{ type: Schema.Types.ObjectId, ref: "UserVideos" }],
  caption: { type: String, default: "" },
});
module.exports = mongoose.model("ProfileUser", Profile);
