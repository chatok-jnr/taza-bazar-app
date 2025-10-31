const mongoose = require('mongoose');
const Admin_infos = require('./adminModel');

const auditSchema = new mongoose.Schema({
  admin_info:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Admin_infos',
    required:[true, 'An admin action need admin ID']
  },
  admin_action:{
    type:String,
    enum:[
      'SUSPEND USER', 'ACTIVE USER', 'VERIFY USER', 'UNVERIFY USER',
      'APPROVE LISTING', 'REJECT LISTING', 'DELETE LISTING',
      'APPROVE REQUEST', 'REJECT REQUEST', 'DELETE REQUEST',
      'SENT ANNOUNCEMENT', 'DELETE ANNOUNCEMENT'
    ]
  },
  action_reasson:{
    type:String,
  }
}, {
  timestamps:true
});

const Admin_audit = mongoose.model('Admin_audit', auditSchema);
module.exports = Admin_audit;