const User_infos = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET, // Fixed typo
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.createUser = async (req, res) => {
  try {
    const { user_name, user_email, user_no, user_birth_date, gender, user_password } = req.body;
    
    // Validation
    if (!user_name || !user_email || !user_no || !user_birth_date || !gender || !user_password) {
      return res.status(400).json({
        status: "failed",
        message: "All fields are required"
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a valid email address"
      });
    }

    // Create user
    const newUser = await User_infos.create(req.body);

    // Prepare response without password
    const userResponse = { ...newUser.toObject() };
    delete userResponse.user_password;

    const token = signToken(userResponse._id);
    
    res.status(201).json({
      status: "success",
      token: token, // Send token to client
      data: {
        user: userResponse
      }
    });

  } catch(err) {
    // Handle duplicate error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        status: "failed",
        message: `User with this ${field.replace('user_', '')} already exists`
      });
    }

    // Handle validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        status: "failed",
        message: messages.join(', ')
      });
    }

    // Handle other errors
    console.error('User creation error:', err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error"
    });
  } 
};

//Login 
exports.loginUser = async (req, res) => {
  try {
    const {user_email, user_password} = req.body;

    //1. Check if credential provided
    if(!user_email || !user_password) {
      return res.status(400).json({
        status:"failed",
        message:"Please provide email and password"
      });
    }

    //2. Find user + include password
    const user = await User_infos.findOne({user_email}).select('+user_password');

    if(user.user_status === 'Suspended') {
      return res.status(400).json({
        status:'failed',
        message:"You have been suspended from the platform"
      });
    }

    console.log(`USER  = ${user}`);

    //3.Verify user exist and password matches
    if(!user || !(await user.correctPassword(user_password))) {
      return res.status(401).json({
        status:"failed",
        message:"Invalid email or password"
      });
    }

    //4.Create JWT token
    const token = signToken(user._id);

    //5. Return user data + token
    const userResponse = {...user.toObject()};
    delete userResponse.user_password;

    res.status(200).json({
      status:"success",
      message:"Login Successfull",
      token,
      data:userResponse
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

//verify user
exports.protect = async (req, res, next) => {
  try {


    //1. extract token from header
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    //2. check if token exist
    if(!token) {
      return res.status(401).json({
        status:"failed",
        message:"You are not logged in. Please Log in to get access"
      });
    }

    //3. Verify token signature
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    //4. Check if user still exist in databse
    const currentUser = await User_infos.findById(decode.id);


    if(!currentUser) {
      return res.status(400).json({
        status:"failed",
        message:"This user belonging to this token no longer exist."
      });
    }

    const userStatus = User_infos.findById(req.params.id);
    if(userStatus.user_status === 'Suspended') {
      return res.status(401).json({
        status:'failed',
        message:"You have been suspended from the platform"
      })
    }

    req.user = currentUser;

    next();
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

