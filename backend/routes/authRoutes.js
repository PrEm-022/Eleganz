const express = require("express");
const router = express.Router();
const { signup, login, getUser } = require("../controllers/authController");
const { fetchUser } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/getuser", fetchUser, getUser);

module.exports = router;
