const mongoose = require('mongoose');
const Admin_infos = require('./adminModel');

const announcementSchema = new mongoose.Schema({
  admin_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Admin_infos',
    required:true
  },
  announcement:{
    type:String,
    required:true
  }
}, {
  timestamps:true
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement