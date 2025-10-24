const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true // Removes extra spaces
  },
  email: {
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
  phone_no: {
    type: String,
    required: [true, 'A user must have a phone number'],
    unique: true
  },
  date_of_birth: {
    type: Date, // Consider using Date type
    required: [true, 'A user must have a birth date'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

adminSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Admin_infos = mongoose.model('Admin_infos', adminSchema);

module.exports = Admin_infos;

/*
{
  "name":"Md. Sakib Hosen",
  "email":"md.sakib.hos3n@gmail.com",
  "phone_no":"01971311958",
  "date_of_birth":"10-Feb-2003",
  "gender":"Male",
  "password":""
}
*/