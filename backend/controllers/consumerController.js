const Consumer_request = require('./../models/consumerModel');
const Consumer_to_admin = require('./../models/consumerToAdminReqModel');
const Announcement = require('./../models/adminAnnouncementModel');

// Create New Request
exports.createReq = async (req, res) => {
  try{
    let admin_deal = false;

    [admin_deal, req.body.admin_deal] = [req.body.admin_deal, admin_deal];
    const newReq = await Consumer_request.create(req.body);

    if(admin_deal) await Consumer_to_admin.create({'id':newReq._id});  

    res.status(201).json({
      status:"Success",
      data:newReq
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

// Get all request
exports.getAllReq = async (req, res) => {

  try {
    const allReq = await Consumer_request.find()
      .sort({createdAt:-1});
    
    res.status(200).json({
      status:"Success",
      data:{
        req:allReq
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

// Get request by user
exports.getUserReq = async (req, res) => {
  try {
    const userReq = await Consumer_request.find({user_id:req.params.id})
      .sort({createdAt:-1});

    res.status(200).json({
      status:"Success",
      data:{
        req:userReq
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

// update req
exports.updateReq = async (req, res) => {
  try {
    const updReq = await Consumer_request.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
    });

    res.status(200).json({
      status:"Success",
      data:{
        req:updReq
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

//delete req
exports.deleteReq = async (req, res) => {
  try {
    const Req = await Consumer_request.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status:"Success",
      message:"The request has been deleted successfully",
      data:null
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

//Get All announcement
exports.getAnnouncement = async(req, res) => {
  try{
    const allAnnouncement = await Announcement.find()
    .sort({'createdAt':-1});

    if(!allAnnouncement) {
      return res.status(404).josn({
        status:'Not Found',
        message:'Failed to fetch the announcement'
      });
    }

    res.status(200).json({
      status:'success',
      allAnnouncement
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}
