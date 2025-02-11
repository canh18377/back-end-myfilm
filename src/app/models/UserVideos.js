const Profile = require("./ProfileUser");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserVideos = new Schema(
  {
    path: { type: String, required: true },
    filename: { type: String, required: true },
    nameVideo: { type: String },
    limitedAge: { type: String },
    genres: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "Profile" },
    likes: { type: Number, default: 0 },
    likeBy: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    deleteAt: { type: Date, default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("UserVideos", UserVideos);
