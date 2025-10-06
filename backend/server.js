const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(con => {
    console.log("Database connection successful");
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });


const userSchema = new mongoose.Schema({
  user_name:{
    type: String,
    required: [true, 'A user must have a name']
  },
  user_email:{
    type: String,
    required: [true, 'A user must have an email'],
    unique: true
  },
  user_phone:{
    type: String,
    required: [true, 'A user must have a phone number'],
    unique: true
  },
  user_birth_date:{
    type: Date,
    required: true
  },
  user_password:{
    type:String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

app.listen(process.env.PORT, () => {
  console.log("Server is running at 127.0.0.1:8000");
});
