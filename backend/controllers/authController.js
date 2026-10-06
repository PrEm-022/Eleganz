const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @desc    Register new user
// @route   POST /signup or /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        success: false,
        errors: "Found Existing User with same Email address!",
      });
    }

    // Default cart initialization
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new User({
      name: username || req.body.name,
      email: email,
      password: password,
      cartData: cart,
    });

    await user.save();

    // Generate JWT token
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(
      data,
      process.env.JWT_SECRET || "secret_ecom",
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /login or /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, errors: "User Not Found!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({ success: false, errors: "Wrong Password" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(
      data,
      process.env.JWT_SECRET || "secret_ecom",
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /getuser or /api/auth/getuser
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getUser,
};
