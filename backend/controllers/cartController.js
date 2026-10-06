const User = require("../models/User");

// @desc    Add item to cart
// @route   POST /addtocart or /api/cart/addtocart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }

    const itemId = req.body.itemId;
    userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   POST /removefromcart or /api/cart/removefromcart
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }

    const itemId = req.body.itemId;
    if (userData.cartData[itemId] > 0) {
      userData.cartData[itemId] -= 1;
    }

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart data for authenticated user
// @route   POST /getcart or /api/cart/getcart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });
    if (!userData) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }
    res.json(userData.cartData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
