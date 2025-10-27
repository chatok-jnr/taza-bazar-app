const adminModel = require('./../models/adminModel');
const User_infos = require('./../models/userModel');
const Farmer_product = require('./../models/farmerModel');
const Consumer_request = require('./../models/consumerModel');
const farmerBid = require('./../models/farmerBid');
const consumerBid = require('./../models/buyerModel');
const Farmer_to_admin = require('./../models/farmerToAdminReqModel');

// Get list of all user
exports.getAllUser = async (req, res) => {
  try{
    const allUser = await User_infos.find()
      .select('-user_password');

    res.status(200).json({
      status:'success',
      data:allUser
    })
  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    })
  }
}

// Get list of all product
exports.getAllList = async (req, res) => {
  try{
    const allList = await Farmer_product.find();

    res.status(200).json({
      status:'success',
      data:allList
    });

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}

// Get list of all request
exports.getAllReq = async (req, res) => {
  try{
    const allReq = await Consumer_request.find();

    res.status(200).json({
      status:'success',
      data:allReq
    });

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}

// get list of all bid
exports.getAllBid = async (req, res) => {
  try{

    const bid1 = await farmerBid.find();
    const bid2 = await consumerBid.find();

    res.status(200).json({
      status:'success',
      data:{
        faremerBid:bid1,
        consumerBid:bid2
      }      
    });

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}

// Suspend | Active a user
exports.userStatus = async(req, res) => {
  try{

    const {id} = req.params;
    const updates = req.body;

    const updStatus = await User_infos.findByIdAndUpdate(
      id,
      {$set:updates},
      {new:true, runValidators: true}
    );

    if(!updStatus) {
      return res.status(404).json({
        status:'failed',
        message:"User not found"
      })
    }

    let msg = "Active";
    if(req.body.user_status === 'Suspended') msg = "Suspended";

    res.status(200).json({
      status:"success",
      message: `Change the status to ${msg} successfully`
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

//Get all teh listing from farmer which is requested for admin deal
exports.getAllFarmerReq = async(req, res) => {
  try{
    const allReq = await Farmer_to_admin.find()
      .populate('id');

    if(!allReq) {
      return res.status(404).json({
        status:'failed',
        message:'No Data Found'
      });
    }
    
    res.status(200).json({
      status:'Success',
      data:allReq
    })

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}

//Accept or Reject Farmer Req
exports.updateVerdict = async(req, res) => {
  try{

    let admin_deal = false;
    if(req.body.verdict === 'Accepted') admin_deal = true;

    console.log(`Debuging inside = ${req.body.product_ID}`);

    const updProd = await Farmer_product.findByIdAndUpdate(req.body.product_ID, {
      'admin_deal':admin_deal
    }, {
      new:true,
      runValidators:true
    });

    const updVar = await Farmer_to_admin.findByIdAndUpdate(req.body.ID,{
      'verdict':req.body.verdict
    }, {
      new:true,
      runValidators:true
    })

    res.status(200).json({
      status:'success',
      message:"Update Successfully"
    });

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}

// Delete Farmer Request
exports.deleteProduct = async(req, res) => {
  try{

    const dltProd = await Farmer_product.findByIdAndDelete(req.body.ID);

    console.log(`Debug = ${dltProd}`);

    res.status(200).json({
      status:'success',
      message:'The Product has been Deleted successfully'
    });

  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}