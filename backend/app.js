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

// Build allowed origins from env and sensible defaults
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];
const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envAllowedOrigins]));

const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'x-access-token', 'x-refresh-token', 'x-client-id'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight request for 24 hours
};

// CORS middleware and explicit preflight handling (Express 5 requires valid path strings)
app.use(cors(corsOptions));
app.options('/*', cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({
      status: 'error',
      message: 'CORS policy violation: Origin not allowed',
      allowedOrigins
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