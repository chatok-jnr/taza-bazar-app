const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const farmerRouter = require('./routes/farmerRoutes');
const consumerRouter = require('./routes/consumerRoutes');
const buyerRouter = require('./routes/buyerRoutes');
const farmerBidRouter = require('./routes/farmerBidRoutes');
const farmAlert = require('./routes/farmAlertRoutes');
const consumerAlert = require('./routes/consumerAlertRoutes');
const latestProducts = require('./routes/latestProductsRoutes');
const latestRequest = require('./routes/latestRequestRoutes');

// Admin
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// ✅ FIXED CORS Configuration
const allowedOrigins = [
  'https://taza-bazar-app-4l7i.onrender.com', // Your main frontend
  'https://taza-bazar-admin.onrender.com',    // Your admin frontend (from your comment)
  'http://localhost:3000',                    // Local development
  'http://localhost:5173',                    // Vite dev server
];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, Postman)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true // ✅ Important if using cookies/sessions
// }));

app.use(cors({
  origin: true, // Allows any origin
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ✅ FIXED Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      status: 'error',
      message: 'CORS policy violation: Origin not allowed',
      allowedOrigins: allowedOrigins // ✅ Now defined
    });
  } else {
    next(err);
  }
});

// Your routes...
app.use('/api/v1/users', userRouter);
app.use('/api/v1/farmer', farmerRouter);
app.use('/api/v1/consumer', consumerRouter);
app.use('/api/v1/buyer', buyerRouter);
app.use('/api/v1/farmerBid', farmerBidRouter);
app.use('/api/v1/farmAlert', farmAlert);
app.use('/api/v1/consumerAlert', consumerAlert);
app.use('/api/v1/latestProducts', latestProducts);
app.use('/api/v1/latestRequest', latestRequest);

// Admin Routes
app.use('/api/v1/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;