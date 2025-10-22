const mongoose = require('mongoose');
const Farmer_bid = require('./farmerBid');
const Consumer_request = require('./consumerModel');

const alertSchema = new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    required: true
  },
  bidInfo:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Farmer_bid'
  },
  reqInfo:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'Consumer_request'
  },
  status:{
    type:String,
    enum:['Accepted', 'Rejected']
  }
}, {
  timestamps:true
});

const Farm_alert = mongoose.model('Farm_alert', alertSchema);
module.exports = Farm_alert;

/*
{ 
  user_id:
  bidInfo:
  reqInfo
  status:
}
*/