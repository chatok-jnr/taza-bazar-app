const User_infos = require('./../models/userModel');

//Create an Account as a user
exports.createUser = async (req, res) => {
  try {
    const newUser = await User_infos.create(req.body);  
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message
    });
  }
};

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