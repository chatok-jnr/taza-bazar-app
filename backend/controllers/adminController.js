const adminModel = require('./../models/adminModel');
const User_infos = require('./../models/userModel');
const Farmer_product = require('./../models/farmerModel');
const Consumer_request = require('./../models/consumerModel');
const farmerBid = require('./../models/farmerBid');
const consumerBid = require('./../models/buyerModel');
const Farmer_to_admin = require('./../models/farmerToAdminReqModel');
const Consumer_to_admin = require('./../models/consumerToAdminReqModel');
const Admin_audit = require('./../models/adminAuditLogsModel');

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
exports.userStatus = async (req, res) => {
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

    // accept admin_info or adminID from client
    let admin_info = req.body.admin_info || req.body.adminID;
    let admin_action = "";
    if(req.body.user_status === 'Suspended') {
      msg = "Suspended";
      // Match enum in adminAuditLogsModel: 'SUSPEND USER'
      admin_action = "SUSPEND USER"
    } else admin_action = "ACTIVE USER"

    let action_reasson = req.body.action_reasson || "";

    if(action_reasson !== "") await Admin_audit.create({admin_info, admin_action, action_reasson});
    else await Admin_audit.create({admin_info, admin_action});

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

//------------------------------------------------------------------Faremer Product------------------------------------------------------------------
//Get all thelisting from farmer which is requested for admin deal
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

  // accept admin_info or adminID from client
  let admin_info = req.body.admin_info || req.body.adminID;
    let admin_action = "REJECT LISTING";
    if(admin_deal === true) admin_action = "APPROVE LISTING";
    
    if(req.body.action_reasson) await Admin_audit.create({admin_info, admin_action, 'action_reasson':req.body.action_reasson});
    else await Admin_audit.create({admin_info, admin_action}); 

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

  // accept admin_info or adminID from client
  const admin_info = req.body.admin_info || req.body.adminID;

  if(req.body.action_reasson)  await Admin_audit.create({admin_info, 'admin_action':"DELETE REQUEST", 'action_reasson':req.body.action_reasson});
  else await Admin_audit.create({admin_info, 'admin_action':"DELETE REQUEST"});

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

//------------------------------------------------------------------Consumer Request------------------------------------------------------------------

// Get all request from the consumer which is requet for admin deal
exports.getAllConsumerReq = async(req, res) => {
  try{
  const allReq = await Consumer_to_admin.find()
    .populate('id');

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

// Accpet or Reject Consumer Req
exports.updateVerdictConsumer = async (req, res) => {
  try{
    let admin_deal = false;
    let verdict = 'Rejected';
    if(req.body.verdict === 'Accepted') {
      admin_deal = true;
      verdict = 'Accepted';
    }

    const updReq = await Consumer_request.findByIdAndUpdate(req.body.request_ID, {
      'admin_deal':admin_deal
    }, {
      new:true,
      runValidators:true
    });

    console.log(`Debug = ${admin_deal}`);

    const updVerdict = await Consumer_to_admin.findByIdAndUpdate(req.body.ID, {
      'verdict':verdict
    }, {
      new:true,
      runValidators:true
    });

  let admin_action = 'REJECT REQUEST';
    if(admin_deal === true) admin_action = 'APPROVE REQUEST';
  let action_reasson = "";
  if(req.body.action_reasson) action_reasson = req.body.action_reasson
  // accept admin_info or adminID from client
  const admin_info = req.body.admin_info || req.body.adminID;

  await Admin_audit.create({admin_info, admin_action, action_reasson});

    res.status(200).json({
      status:'success',
      message:'Verdict has been updated'
    })
  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
} 

// Delete Consumer Request
exports.deleteConsumerReq = async (req, res) => {
  try{
    const dltConsumerReq = await Consumer_request.findByIdAndDelete(req.body.request_ID);
    
  let action_reasson = "";
  if(req.body.action_reasson) action_reasson = req.body.action_reasson
  // accept admin_info or adminID from client
  const admin_info = req.body.admin_info || req.body.adminID;
  await Admin_audit.create({admin_info, 'admin_action':'DELETE REQUEST', action_reasson});
    
    res.status(202).json({
      status:'success',
      message:'Consumer Request deleted Successfully'
    })
  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    });
  }
}


//Get all audit
exports.auditLogs = async (req, res) => {
  try{
    const allAudit = await Admin_audit.find()
      .sort({'createdAt':-1})
      .populate('admin_info', '_id name')

      res.status(200).json({
        status:'Success',
        allAudit
      });
  } catch(err) {
    res.status(400).json({
      status:'failed',
      message:err.message
    })
  }
}