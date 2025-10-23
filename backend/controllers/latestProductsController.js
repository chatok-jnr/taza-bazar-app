const Farmer_product = require('../models/farmerModel');

//Get latest products
exports.getLatestProducts = async (req, res) => {
  try{
    let latestProducts = await Farmer_product.find({})
      .sort({createdAt : -1})
      .limit(4)
      .select('product_name price_per_unit createdAt')
      .populate('user_id', 'user_name');

    res.status(200).json({
      status:"success",
      data:latestProducts
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    })
  }
};