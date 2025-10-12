const Buyer_request = require('./../models/buyerModel');

exports.alreadyBid = async (req, res, next) => {
  try{

    const verdict = await Buyer_request.findOne({post_id:req.body.post_id, consumer_id:req.body.consumer_id, farmer_id:req.body.farmer_id});

    if(verdict) {
      return res.status(400).json({
        status:"failed",
        message:"You already bid on it"
      });
    }

    next();
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

