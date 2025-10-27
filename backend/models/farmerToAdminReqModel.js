const mongoose = require('mongoose');
const Farmer_product = require('./farmerModel');

const farmerReqSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Farmer_product',
        required:[true, 'A product req must have its id']
    },
    user_type:{
        type:String,
        default:'Farmer'
    },
    verdict:{
        type:String,
        enum:['Pending', 'Accepted', 'Rejected'],
        default:'Pending'
    }
}, {
    timestamps:true
});

const Farmer_to_admin = mongoose.model('Farmer_to_admin', farmerReqSchema);

module.exports = Farmer_to_admin;