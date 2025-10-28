const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// Build MongoDB connection string (supports password substitution pattern used in config.env)
const DB = (process.env.DATABASE || '').replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '');

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
