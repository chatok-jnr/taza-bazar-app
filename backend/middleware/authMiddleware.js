const jwt = require('jsonwebtoken');
const User_infos = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Fixed: Call split on req.headers.authorization, not req.headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Fixed this line
    }

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "You are not logged in! Please log in to get access."
      });
    }

    // 2. Verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User_infos.findById(decode.id);

    if(currentUser.user_status === 'Suspended') {
      return res.status(401).json({
        status:'Failed',
        message:"You have been suspended from the platfrom"
      });
    }

    // 3. Check if user still exists
    if (!currentUser) {
      return res.status(401).json({
        status: "failed",
        message: "The user belonging to this token no longer exists"
      });
    }

    // 4. Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    // Handle JWT specific errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: "failed",
        message: "Invalid token"
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: "failed",
        message: "Token has expired"
      });
    }

    res.status(400).json({
      status: "failed",
      message: err.message
    });
  }
}

module.exports = { protect };