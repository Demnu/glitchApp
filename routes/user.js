const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  readSavedRefreshTokens,
  logout,
  refreshToken,
} = require("../controllers/user");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refreshToken).get(readSavedRefreshTokens);
module.exports = router;
