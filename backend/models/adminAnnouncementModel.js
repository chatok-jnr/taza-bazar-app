const mongoose = require('mongoose');
const adminInfo = require('./adminModel');

const announcementSchema = new mongoose.Schema({
  admin_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'adminInfo',
    required:true
  },
  announcement:{
    type:String,
    required:true
  }
});

const Announcement = mongoose.model('Announcemnet', announcementSchema);

module.exports = Announcement