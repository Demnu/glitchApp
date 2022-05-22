const { createAccessToken, createRefreshToken } = require("./auth");
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const { verify } = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

var refreshTokens = [];
const register = async (req, res) => {
  const hashedPassword = await hash(req.body.password, 12);
  await User.create({
    email: req.body.email,
    password: hashedPassword,
  }).catch((e) => {
    console.log(e);
  });

  res.status(200);
};

const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  var error;
  var valid = false;
  try {
    if (!user) {
      error = "Could not find user";
      throw new Error("could not find user");
    }
    valid = await compare(req.body.password, user.password);
    if (!valid) {
      error = "Incorrect password";
      throw new Error("incorrect password");
    }
    var refreshToken = createRefreshToken(user);
    refreshTokens.push(refreshToken);
    await User.updateOne({ _id: user._id }, { refreshToken: refreshToken });
    res
      .status(200)
      .cookie("ADGKaPdSgVkYp3s6v9y$BEHMcQ", refreshToken, {
        expires: new Date(253402300000000),
        httpOnly: true,
        secure: false,
        SameSite: "none",
        // secure: true,
      })
      .cookie("hasCookie", "true", {
        expires: new Date(253402300000000),
        httpOnly: false,
        secure: false,
        SameSite: "none",
      })
      .send();
  } catch (e) {
    res.status(406).send(error);
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).send("You are not authenticated");
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(401).send("Refresh token is not valid");
  }
  verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    console.log(user);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newRefreshToken = createRefreshToken(user);
    refreshTokens.push(newRefreshToken);
    res.status(400).json({ accessToken: createAccessToken(user) });
  });
};

const refreshToken = async (req, res) => {
  const token = req.cookies.ADGKaPdSgVkYp3s6v9y$BEHMcQ;
  if (!token) {
    return res.status(401).send({ ok: false, accessToken: "" });
  }
  var payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_KEY);
  } catch (err) {
    console.log(err);
    return res.status(401).send({ ok: false, accessToken: "" });
  }
  const user = await User.findOne({ _id: payload.userID });
  if (!user) {
    return res.status(401).send({ ok: false, accessToken: "" });
  }

  res
    .status(200)
    .cookie("ADGKaPdSgVkYp3s6v9y$BEHMcQ", createRefreshToken(user), {
      httpOnly: true,
      // secure: true,
    })
    .send({ ok: true, accessToken: createAccessToken(user) });
};

// const logout = async (req, res) => {
//   const refreshToken = req.body.token;
//   refreshTokens = refreshTokens.filter((token) => token != refreshToken);
//   res.status(200).json("Logged out");
// };

const readSavedRefreshTokens = async (req, res) => {
  res.json(refreshTokens);
};

const authenticate = async (req, res) => {
  const token = req.cookies.ADGKaPdSgVkYp3s6v9y$BEHMcQ;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(401).send(err);
  }
  return res.status(200).send("Valid Authentication");
};

const logout = async (req, res) => {
  console.log(req.cookies.ADGKaPdSgVkYp3s6v9y$BEHMcQ);
  res.clearCookie("ADGKaPdSgVkYp3s6v9y$BEHMcQ");
  res.status(200).send("Logged Out");
};

module.exports = {
  register,
  login,
  refresh,
  readSavedRefreshTokens,
  logout,
  refreshToken,
  authenticate,
  logout,
};
