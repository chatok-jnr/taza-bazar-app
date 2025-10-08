const Farmer_product = require('./../models/farmerModel');

// Green Light
exports.createProduct = async (req, res) => {
  try{
    const newProduct = await Farmer_product.create(req.body);
    res.status(200).json({
      status:"success",
      data:{
        product:newProduct
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    });
  }
}

//Green Light
exports.getAllProduct = async(req, res) => {
  try{
    const allProduct = await Farmer_product.find();
    res.status(200).json({
      stus:"success",
      data:{
        product:allProduct
      }
    });
  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}

exports.getProductByUser = async(req, res) => {
  try{
    const products = await Farmer_product.find({user_id:req.params.id});

    res.status(200).json({
      status:"success",
      data:{
        products:products
      }
    });

  } catch(err) {
    res.status(400).json({
      status:"failed",
      message:err.message
    });
  }
}