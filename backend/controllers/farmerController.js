const Farmer_product = require('./../models/farmerModel');

// Create a new product
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

//List of all prodcut
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

//List of all product of user x
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

//Update a product
exports.updateProduct = async(req, res) => {

  try{

    const updProd = await Farmer_product.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
    });

    res.status(201).json({
      status:"Success",
      data:updProd
    });
  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    })
  }
}

// Delete a product
exports.deleteProduct = async (req, res) => {
  try{
    const dltProd = await Farmer_product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status:"successs",
    });

  } catch(err) {
    res.status(400).json({
      status:"Failed",
      message:err.message
    })
  }
}

// exports.gerProduct = async(req, res) => {
//   try{
//     const prod = await 
//     res.status(200).json({
//       status:"success",
//       message:
//     })
//   } catch(err) {
//     res.status(400).json({
//       status:"failed",
//       message:err.message
//     })
//   } 
// }
