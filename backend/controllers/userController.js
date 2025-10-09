const User_infos = require('./../models/userModel');
const bcrypt = require('bcrypt');
const sltRounds = 12;

//Create an Account as a user (Sign UP)
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
    
    // Create user
    const newUser = await User_infos.create(req.body);

    // Prepare response without password
    const userResponse = { ...newUser.toObject() };
    delete userResponse.user_password;

    res.status(201).json({
      status: "success",
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
    res.status(500).json({
      status: "failed",
      message: err.message
    });
  } 
};

//Login 
exports.loginUser = async (req, res) => {
  try{
    
    const {user_email, user_password} = req.body;

    console.log(user_password);

    const user = await User_infos.findOne({user_email}).select('+user_password');

    if(!user || !(await user.correctPassword(user_password))) {
      return res.status(404).json({
        status:"failed",
        message:"Invalid email or password"
      });
    }

    const userResponse = {...user.toObject()};
    delete userResponse.user_password;

    res.status(200).json({
      status:"success",
      message:"Login successfull",
      data:userResponse
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  } 
}

//Get the list of all the user
exports.getAllUser = async (req, res) => {
  try{
    const users = await User_infos.find();
    res.status(200).json({
      status:"success",
      result:users.length,
      data:{
        users
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

//Get a specific user by id
exports.getUser = async (req, res) => {
  try{
    const user = await User_infos.findById(req.params.id);

    res.status(200).json({
      status:"success",
      data: user
    })
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

//Delete a user account
exports.deleteUser = async (req, res) => {
  try{
    const dltUsr = await User_infos.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status:"success",
      message:`User ${req.params.id} has been delted successfully`,
      data:{
        data:dltUsr
      }
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    }); 
  }
}

//Update a user information
exports.updateUser = async(req, res) => {
  try{

    const updUser = await User_infos.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
    });

    res.status(200).json({
      status:"Success",
      message:"Your Profile has been updated"
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    }) 
  }
}