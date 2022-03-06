const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  readSavedRefreshTokens,
  logout,
  refreshToken,
  authenticate,
} = require("../controllers/user");

router.route("/register").post(register);
router.route("/register").get(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/refresh").post(refreshToken);
router.route("/authenticate").get(authenticate);
module.exports = router;
