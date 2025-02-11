const mongoose = require("mongoose");
const Profile = require("./ProfileUser");
const UserVideos = require("./UserVideos"); // Import UserVideos schema

const { Schema } = mongoose;
const LikedVideos = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "Profile" },
  likedVideos: [String],
});
module.exports = mongoose.model("LikedVideos", LikedVideos);
