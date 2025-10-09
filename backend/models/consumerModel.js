const mongoose = require('mongoose');

const consumerSchema = new mongoose.Schema({
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
  when:{
    type:Date,
    required:[true, 'From what day you need that product']
  },
  request_description:{
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

const Consumer_request = mongoose.model('Consumer_request', consumerSchema);
module.exports = Consumer_request;

/*
{
  "user_id":"68e5ec564c970c9ed759d154",
  "product_name":"Kola",
  "product_quantity":10,
  "quantity_unit":"piece",
  "price_per_unit":69,
  "product_descriptionn":"Bery big kola",
  "when":10-Feb-2026,
  "request_description":"I need some lal tomato",
  "admin_deal":true
}
*/