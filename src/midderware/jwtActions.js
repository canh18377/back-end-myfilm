const jwt = require("jsonwebtoken");
require("dotenv").config();
const secrectkey = process.env.secrectkey;
const createJwt = (account) => {
  const token = jwt.sign(
    { name: account.name, password: account.password },
    secrectkey,
    { expiresIn: "1h" }
  );
  return token;
};
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secrectkey, function (err, decoded) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          const { name, password } = jwt.decode(token);
          console.log({ name, password });
          const newToken = createJwt({ name, password });
          resolve({ name, password, newToken });
        } else {
          reject(err);
        }
      } else {
        resolve(decoded);
      }
    });
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = { createJwt, verifyToken };
