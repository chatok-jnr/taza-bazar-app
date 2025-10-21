const mongoose = require('mongoose');
const bid_info = require('./farmerBid');
const req_info = require('./consumerModel');

const alertSchema = new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    required: true
  },
  bidInfo:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'bid_info'
  },
  reqInfo:{
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'req_info'
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