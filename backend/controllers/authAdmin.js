const Admin_infos = require('./../models/adminModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET, // Fixed typo
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};


// For SignUp
exports.signUp = async (req, res) => {
  try{
    const {name, email, phone_no, date_of_birth, gender, password} = req.body;

    if(!name || !email || !phone_no || !date_of_birth || !gender || !password) {
      return res.status(400).json({
        status:'failed',
        message:'All fields required'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a valid email address"
      });
    }

    let newAdmin = await Admin_infos.create(req.body);

    const token = signToken(newAdmin._id);
    newAdmin.password = "Fuck You"

    res.status(201).json({
      status:'Admin Created Successfully',
      token,
      data: newAdmin
    })

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}


// For SignIn
exports.signIn = async (req, res) => {
  try{
    const {email, password} = req.body;

    if(!email || !password) {
      return res.status(400).json({
        status:"failed",
        message:'Please provide email and password'
      });
    }

    const admin = await Admin_infos.findOne({email})
      .select('+password');

    if(!admin || !(await admin.correctPassword(password))) {
      return res.status(401).json({
        status:'failed',
        message:'Invalid email or password'
      });
    }

    const token = signToken(admin._id);

    const adminResponse = {...admin.toObject()};
    delete adminResponse.password;

    res.status(200).json({
      status:"success",
      message:"Login Successfull",
      token,
      data:adminResponse
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    })
  }
}


//verify user
exports.protect = async(req, res, next) => {
  try{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
      return res.status(401).json({
        status:"failed",
        message:"You are not logged in. Please Log in to get access"
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await Admin_infos.findById(decode.id);

    if(!currentUser) {
      res.status(400).json({
        status:"failed",
        message:"This admin belonging to this token no longer exist."
      });
    }

    req.user = currentUser;

    next();
  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}
