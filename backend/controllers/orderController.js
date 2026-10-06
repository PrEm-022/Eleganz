const Order = require("../models/Order");
const User = require("../models/User");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay Instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_TkjyWEfvDQ5eMV",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "uxfpE9FE0dNbrUNsiL5q1sTg",
});

// @desc    Create Razorpay Order
// @route   POST /razorpay/create-order or /api/orders/razorpay/create-order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, errors: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_TkjyWEfvDQ5eMV",
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature & Save Order
// @route   POST /razorpay/verify or /api/orders/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      address,
      paymentMethod,
    } = req.body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "uxfpE9FE0dNbrUNsiL5q1sTg";
    const bodyData = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(bodyData.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, errors: "Payment verification failed. Invalid Signature." });
    }

    // Save order in database with paymentStatus = true
    const newOrder = new Order({
      userId: req.user.id,
      items: items,
      amount: amount,
      address: address,
      paymentMethod: paymentMethod || "Razorpay",
      paymentStatus: true,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "Order Placed",
    });

    await newOrder.save();

    // Clear user cart
    let emptyCart = {};
    for (let i = 0; i < 300; i++) {
      emptyCart[i] = 0;
    }
    await User.findByIdAndUpdate(req.user.id, { cartData: emptyCart });

    res.json({
      success: true,
      message: "Payment Verified & Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    next(error);
  }
};

// @desc    Place a new order (COD or direct)
// @route   POST /placeorder or /api/orders/place
// @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const { items, amount, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, errors: "Cart is empty" });
    }

    const newOrder = new Order({
      userId: req.user.id,
      items: items,
      amount: amount,
      address: address,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod !== "COD", // Marked true for online test payments, false for COD
      status: "Order Placed",
    });

    await newOrder.save();

    // Clear user cart data after placing order
    let emptyCart = {};
    for (let i = 0; i < 300; i++) {
      emptyCart[i] = 0;
    }
    await User.findByIdAndUpdate(req.user.id, { cartData: emptyCart });

    res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user orders
// @route   POST /userorders or /api/orders/userorders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for Admin
// @route   GET /listorders or /api/orders/list
// @access  Public (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status from Admin
// @route   POST /updatestatus or /api/orders/status
// @access  Public (Admin)
const updateStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status: status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateStatus,
};
