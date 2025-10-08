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


app.listen(process.env.PORT, () => {
  console.log("Server is running at 127.0.0.1:8000");
});
