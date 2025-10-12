const Buyer_request = require('./../models/buyerModel');

//Place a Bid
exports.placeBid = async (req, res) => {
  try{
    const bid = await Buyer_request.create(req.body);

    res.status(201).json({
      status:"success",
      message:"You be placed a bid",
      data:{
        bidInfo:bid
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

//Accepted || Rejected
exports.updateBid = async(req, res) => {
  try{
    const bid = await Buyer_request.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
      runValidators:true
    });
    
    console.log(req.params.id);

    if(!bid) {
      return res.status(404).json({
        status:'failed',
        message:"bid not found"
      });
    }

    res.status(200).json({
      status:"success",
      message:"Your bid updated successfully",
      data:{
        updInfo:bid
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    })
  }
}

//Get all bids by post_id
exports.bidPlaced = async(req, res) => {

  const bids = await Buyer_request.find({post_id:req.body.post_id});

  try {
    res.status(200).json({
      status:"success",
      data:{
        bids
      }
    })
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

//accepted Bid
exports.acceptedBid = async (req, res) => {
  try{
    const acBid = await Buyer_request.find({consumer_id:req.body.consumer_id, status:"Accepted"});

    if(!acBid) {
      return res.status(400).json({
        status:"failed",
        message:"No bids are accepted yet"
      });
    }

    res.status(200).json({
      status:"success",
      acBid
    })

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    })
  }
}

