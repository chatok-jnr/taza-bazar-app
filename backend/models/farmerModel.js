const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_infos',
    required: [true, 'A Product must contain its owner ID'],
  },
  product_name:{
    type:String,
    required:[true, 'A product must have a name'],
    trim:true
  },
  product_quantity:{
    type:Number,
    required:[true, 'A product must have a quantity'],
    min:[0, 'Product quantity cant be negative']
  },
  quantity_unit:{
    type: String,
    enum:['kg', 'g', 'lb', 'piece', 'bundle'],
    default:'kg'
  },
  price_per_unit:{
    type:Number,
    required:[true, 'A Prodcut must have a price'],
    min:[1, 'Product price cant  be negative']
  },
  currency:{
    type:String,
    default:'BDT'
  },
  from:{
    type:Date,
    required:[true, 'A product must have a date which will indicate From when this product can be deliverd']
  },
  to:{
    type:Date,
    required:[true, 'A product must have a date which will indicate till when this product can be deliverd']
  },
  product_description:{
    type:String,
    trim:true
  },
  admin_deal:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true
});

const Farmer_product = mongoose.model('Farmer_product', farmerSchema);
module.exports = Farmer_product;

/*
{
  "user_id":"68e5d16d2657c59edfeae7b3",
  "product_name":"Kola",
  "product_quantity":10,
  "quantity_unit":"piece",
  "price_per_unit":69,
  "product_descriptionn":"Bery big kola"
  "from":"2025-10-15",
  "to":"2025-10-15",
}
*/