const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProfileUser = require("./ProfileUser");
const FollowList = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "ProfileUser" },
  follower: [String],
  following: [String],
});
module.exports = mongoose.model("FollowList", FollowList);
