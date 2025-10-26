const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true // Removes extra spaces
  },
  user_email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true, // Converts to lowercase
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  user_no: {
    type: String,
    required: [true, 'A user must have a phone number'],
    unique: true
  },
  user_birth_date: {
    type: Date, // Consider using Date type
    required: [true, 'A user must have a birth date'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  user_password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  active_listing:{
    type:Number,
    default:0,
    min:[0, 'Active list cannot be negative']
  },
  verified:{
    type:Boolean,
    default:0
  },
  user_status:{
    type:String,
    enum:['Active', 'Suspended'],
    default:'Active'
  },
  total_revenue:{
    type:Number,
    default:0
  },
  total_spent:{
    type:Number,
    default:0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});


userSchema.pre('save', async function (next) {
  if(!this.isModified('user_password')) return next();

  this.user_password = await bcrypt.hash(this.user_password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.user_password);
};

const User_infos = mongoose.model('User_infos', userSchema);

module.exports = User_infos;

/*
{
  "user_name":"Md. Sakib Hosen",
  "user_email":"md.sakib.hos3n@gmail.com",
  "user_no":"+8801971311958",
  "user_birth_date":"10-feb-2003",
  "gender":"Male",
  "user_password":"supremeLeader",
}
*/