const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateStatus,
} = require("../controllers/orderController");
const { fetchUser } = require("../middleware/authMiddleware");

// Razorpay routes
router.post("/razorpay/create-order", fetchUser, createRazorpayOrder);
router.post("/razorpay-create", fetchUser, createRazorpayOrder);

router.post("/razorpay/verify", fetchUser, verifyRazorpayPayment);
router.post("/razorpay-verify", fetchUser, verifyRazorpayPayment);

// User routes
router.post("/place", fetchUser, placeOrder);
router.post("/placeorder", fetchUser, placeOrder);

router.post("/userorders", fetchUser, getUserOrders);
router.get("/userorders", fetchUser, getUserOrders);

// Admin routes
router.get("/list", getAllOrders);
router.get("/listorders", getAllOrders);

router.post("/status", updateStatus);
router.post("/updatestatus", updateStatus);

module.exports = router;
