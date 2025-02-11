const jwtActions = require("../../midderware/jwtActions");
const Account = require("../models/Account");
const Profile = require("../models/ProfileUser");
class account {
  async createAccount(req, res) {
    try {
      const available = await Account.findOne({ name: req.body.name });
      if (available) {
        res.json({ fail: "tài khoản đã tồn tại" });
      } else {
        const account = await Account.create({
          name: req.body.name,
          password: req.body.password,
        });
        console.log(account);
        const profile = await Profile.create({ author: account._id });
        console.log("profile:", profile);

        res.json({
          success: "tạo thành công tài khoản ",
          profileInfo: profile,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async generateToken(req, res) {
    const { name, password } = req.body;
    try {
      const response = await Account.findOne({ name: name });
      if (response) {
        if (response.password === password) {
          const Token = jwtActions.createJwt({
            name: response.name,
            password: response.password,
          });
          console.log("yourAccount", response);
          const profileInfo = await Profile.findOne({
            author: response._id,
          });
          console.log(profileInfo);

          res.json({
            message: "đăng nhập thành công",
            Token: Token,
            profileInfo: profileInfo,
          });
        } else {
          res.json({ message: "sai thông tin đăng nhập" });
        }
      } else {
        res.json({ message: "sai thông tin đăng nhập" });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new account();
