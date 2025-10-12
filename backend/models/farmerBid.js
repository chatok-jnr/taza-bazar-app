const mongoose = require('mongoose');
const User_infos = require('./userModel');

const farmerBidSchema = new mongoose.Schema({
  request_id:{
    type:mongoose.Schema.ObjectId,
    reqired:[true, 'Reques id is needed'],
    ref:'Consumer_request'
  },
  consumer_id:{
    type:mongoose.Schema.ObjectId,
    require:[true, 'The request owner must have an id'],
    ref:'User_infos'
  },
  farmer_id:{
    type:mongoose.Schema.ObjectId,
    require:[true, 'The bidder must have an id'],
    ref:'User_infos'
  },
  farmer_name:{
    type:String,
    require:[true,'A bidder must have a name'],
    ref:'User_infos'
  },
  quantity:{
    type:Number,
    require:[true, 'A bid must have a amount how much he can sell'],
    min:1
  },
  price_per_unit:{
    type:Number,
    required:true,
    min:1
  },
  farm_location:{
    type:String,
    required:true,
  },
   message:{
    type:String
  },
  status:{
    type:String,
    enum:['Pending', 'Accepted', 'Rejected'],
    default:'Pending'
  }
}, {
  timestamps:true
});

const Farmer_bid = mongoose.model('Farmer_bid', farmerBidSchema);

module.exports = Farmer_bid;
/*
{
  "request_id":"paste_the_request_id_here",
  "consumer_id":"paste_the_consumer_id_here",
  "farmer_id":"paste_the_farmer_id_here",
  "farmer_name":"paste_the_farmer_name_here",
  "quantity": ,
  "price_per_unit": ,
  "farm_location": ,
  "message": ,
}
*/