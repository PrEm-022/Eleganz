const jwt = require("jsonwebtoken");

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token") || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({
      success: false,
      errors: "Please authenticate using a valid token",
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      errors: "Invalid or expired authentication token",
    });
  }
};

module.exports = { fetchUser };
