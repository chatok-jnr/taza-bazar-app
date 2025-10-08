const User_infos = require('./../models/userModel');

//Green light
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

//Green light
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

//You have to hande the ID thing
exports.getUser = async (req, res) => {
  try{
    const user = await User_infos.findById(req.params.id);

    res.status(200).json({
      status:"success",
      data:user
    })
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}
