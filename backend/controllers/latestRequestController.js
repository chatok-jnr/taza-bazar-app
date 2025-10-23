const consumer = require('./../models/consumerModel');

exports.latestRequest = async(req, res) => {
  try{

    const latestReq = await consumer.find({})
      .sort({createdAt:-1})
      .select('_id product_name product_quantity quantity_unit price_per_unit createdAt')
      .limit(4)
      .populate('user_id', 'user_name');

    res.status(200).json({
      status:"success",
      data:latestReq
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}