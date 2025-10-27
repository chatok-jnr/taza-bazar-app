const mongoose = require('mongoose');
const Consumer_request = require('./consumerModel');

const consumerReqSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Consumer_request',
        required:[true, 'A consumer req must have its id']
    },
    verdict:{
        type:String,
        enum:['Pending', 'Accepted', 'Rejected'],
        default:'Pending'
    }
}, {
    timestamps:true
});

const Consumer_to_admin = mongoose.model('Consumer_to_admin', consumerReqSchema);

module.exports = Consumer_to_admin;