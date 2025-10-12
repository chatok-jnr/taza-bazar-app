const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
  post_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer_product',
    require:[true, 'A bid must have the product id']
  },
  consumer_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_infos',
    required: [true, 'A bid must have the buyer ID']
  },
  farmer_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_infos',
    required: [true, 'A bid must have the seller ID']
  },
  bid_price:{
    type:Number,
    required:true,
    min:1
  },
  requested_quantity:{
    type:Number,
    required:true
  },
  status:{
    type:String,
    enum:['Accepted', 'Rejected', 'Pending'],
    default:'Pending'
  },
  message:{
    type:"String"
  }
},{
  timestamps:true
});

const Buyer_request = mongoose.model('Buyer_request', buyerSchema);
module.exports = Buyer_request;

/*
  "post_id":,
  "consumer_id":user_id from the user,
  "farmer_id":"user_id from the post",

  "bid_price":,
  "request_qunatity",
  "status":"Pending",
  "message":"Hola"
*/