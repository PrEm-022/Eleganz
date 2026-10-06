const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

router.post("/", upload.single("product"), uploadImage);

module.exports = router;
