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

//Admin
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// Security Headers
app.use((req, res, next) => {
  res.set({
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block'
  });
  next();
});

app.use(
  cors({
    origin: function(origin, callback) {
      const allowedOrigins = [
        'https://taza-bazar-app-4l7i.onrender.com',
        'https://taza-bazar-admin.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000'
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'x-access-token', 'x-refresh-token', 'x-client-id'],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // Cache preflight request for 24 hours
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// CORS error handler
app.use((err, req, res, next) => {
  if (err.message === 'The CORS policy for this site does not allow access from the specified Origin.') {
    res.status(403).json({
      status: 'error',
      message: err.message,
      allowedOrigins: [
        'https://taza-bazar-app-4l7i.onrender.com',
        'https://taza-bazar-admin.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000'
      ]
    });
  } else {
    next(err);
  }
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/farmer', farmerRouter);
app.use('/api/v1/consumer', consumerRouter);
app.use('/api/v1/buyer', buyerRouter);
app.use('/api/v1/farmerBid', farmerBidRouter); //https://taza-bazar-admin.onrender.com/api/v1/farmerBid
app.use('/api/v1/farmAlert', farmAlert);
app.use('/api/v1/consumerAlert', consumerAlert);
app.use('/api/v1/latestProducts', latestProducts)
app.use('/api/v1/latestRequest', latestRequest)

//Admin Routes
app.use('/api/v1/admin', adminRoutes);

// Health check (useful for deployment platforms)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
module.exports = app;