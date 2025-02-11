const mongoose = require("mongoose");
require("dotenv").config();
const URL_DB = process.env.URL_DB;
function connect() {
  try {
    mongoose.connect(URL_DB);
    console.log("connect successfully");
  } catch (error) {
    console.log("fail connection");
  }
}
module.exports = { connect };
