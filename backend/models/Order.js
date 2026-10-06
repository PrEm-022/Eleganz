const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Razorpay", "UPI", "Card", "NetBanking", "Online"],
    default: "COD",
  },
  paymentStatus: {
    type: Boolean,
    default: false,
  },
  razorpayOrderId: {
    type: String,
    default: "",
  },
  razorpayPaymentId: {
    type: String,
    default: "",
  },
  razorpaySignature: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Order Placed",
    enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
