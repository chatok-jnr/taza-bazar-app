const mongoose = require('mongoose');

const consumerSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User_infos',
    required: true
  },
  product_name:{
    type:String,
    required:[true, 'A product must have an name']
  },
  quantity:{
    type:Number,
    required:true,
    min:1
  },
  
});