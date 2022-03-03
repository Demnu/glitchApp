const { sign } = require("jsonwebtoken");
const createAccessToken = (user) => {
  return (accessToken = sign(
    {
      userID: String(user._id),
      email: String(user.email),
      isAdmin: user.isAdmin,
    },
    process.env.TOKEN_KEY,
    { expiresIn: "1m" }
  ));
};

const createRefreshToken = (user) => {
  return (refreshToken = sign(
    {
      userID: String(user._id),
      email: String(user.email),
      isAdmin: user.isAdmin,
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: "2m" }
  ));
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};
