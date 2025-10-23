const User_infos = require('./../models/userModel');

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
    const updUser = await User_infos.findById(req.params.id);

    if(!updUser) {
      return res.status(400).json({
        status:"failed",
        message:"User not found"
      });
    }

    // Handle special increment parameters
    if (req.body.increment_revenue !== undefined) {
      // Add to existing total_revenue
      const currentRevenue = parseFloat(updUser.total_revenue || 0);
      const incrementAmount = parseFloat(req.body.increment_revenue);
      updUser.total_revenue = currentRevenue + incrementAmount;
      console.log(`Incremented revenue for user ${req.params.id} from ${currentRevenue} to ${updUser.total_revenue}`);
      
      // Remove the special parameter
      delete req.body.increment_revenue;
    }
    
    if (req.body.increment_spent !== undefined) {
      // Add to existing total_spent
      const currentSpent = parseFloat(updUser.total_spent || 0);
      const incrementAmount = parseFloat(req.body.increment_spent);
      updUser.total_spent = currentSpent + incrementAmount;
      console.log(`Incremented spent for user ${req.params.id} from ${currentSpent} to ${updUser.total_spent}`);
      
      // Remove the special parameter
      delete req.body.increment_spent;
    }

    // Handle regular updates for other fields
    Object.assign(updUser, req.body);
    await updUser.save();
    
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