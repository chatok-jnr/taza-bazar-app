const Farmer_bid = require('./../models/farmerBid');

//post Place a new bid
exports.placeBid = async (req, res) => {
  try{

    const bid = await Farmer_bid.create(req.body);

    res.status(201).json({
      status:"successfull",
      message:"You be successfully place a bid"
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    })
  }
}

//GET Get all bid by req id
exports.getAllBid = async(req, res) => {
  try{

    const allBid = await Farmer_bid.find({post_id:req.params.id});

    if(!allBid) {
      return res.status(400).json({
        status:"failed",
        message:"No bid is placed yet"
      })
    }

    res.status(200).json({
      status:"success",
      data:allBid
    });
  } catch(err){
    res.status(400).json({
      status:"failed",
      message:err.message
    })
  }
}

// PATCH Update a bid by consumer
exports.consumerDecession = async (req, res) => {

  const updBid = await Farmer_bid.findOneById(req.body, {
    new: true,
    runValidators:true
  });

  try{
    res.status(200).json({
      status:"success",
      data:updBid
    });
  } catch(err){
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}
/*
{
  id:paste_the_bid_id_here
  status:"Accepted"
}
*/